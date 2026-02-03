import { db } from "./db";
import { 
  users, birds, trainings, tournaments, enrollments,
  type User, type InsertUser, 
  type Bird, type InsertBird,
  type Training, type InsertTraining,
  type Tournament, type InsertTournament,
  type Enrollment, type InsertEnrollment
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Birds
  getBird(id: number): Promise<Bird | undefined>;
  getBirdsByOwner(ownerId: number): Promise<Bird[]>;
  createBird(bird: InsertBird): Promise<Bird>;
  updateBird(id: number, bird: Partial<InsertBird>): Promise<Bird>;
  deleteBird(id: number): Promise<void>;

  // Trainings
  getTrainingsByBird(birdId: number): Promise<Training[]>;
  createTraining(training: InsertTraining): Promise<Training>;

  // Tournaments
  getTournament(id: number): Promise<Tournament | undefined>;
  getTournaments(): Promise<(Tournament & { organizer: { name: string } })[]>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournamentResults(results: { enrollmentId: number, score: number, rank: number }[]): Promise<void>;

  // Enrollments
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByTournament(tournamentId: number): Promise<Enrollment[]>;
  
  // Rankings
  getRankings(): Promise<{ birdName: string, ownerName: string, totalScore: number, species: string }[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Birds
  async getBird(id: number): Promise<Bird | undefined> {
    const [bird] = await db.select().from(birds).where(eq(birds.id, id));
    return bird;
  }

  async getBirdsByOwner(ownerId: number): Promise<Bird[]> {
    return db.select().from(birds).where(eq(birds.ownerId, ownerId));
  }

  async createBird(insertBird: InsertBird): Promise<Bird> {
    const [bird] = await db.insert(birds).values(insertBird).returning();
    return bird;
  }

  async updateBird(id: number, updates: Partial<InsertBird>): Promise<Bird> {
    const [bird] = await db.update(birds).set(updates).where(eq(birds.id, id)).returning();
    return bird;
  }

  async deleteBird(id: number): Promise<void> {
    await db.delete(birds).where(eq(birds.id, id));
  }

  // Trainings
  async getTrainingsByBird(birdId: number): Promise<Training[]> {
    return db.select().from(trainings)
      .where(eq(trainings.birdId, birdId))
      .orderBy(desc(trainings.date));
  }

  async createTraining(insertTraining: InsertTraining): Promise<Training> {
    const [training] = await db.insert(trainings).values(insertTraining).returning();
    return training;
  }

  // Tournaments
  async getTournament(id: number): Promise<Tournament | undefined> {
    const [tournament] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return tournament;
  }

  async getTournaments(): Promise<(Tournament & { organizer: { name: string } })[]> {
    const result = await db.select({
      id: tournaments.id,
      organizerId: tournaments.organizerId,
      name: tournaments.name,
      location: tournaments.location,
      date: tournaments.date,
      description: tournaments.description,
      entryFee: tournaments.entryFee,
      prizes: tournaments.prizes,
      status: tournaments.status,
      createdAt: tournaments.createdAt,
      organizerName: users.name,
    })
    .from(tournaments)
    .innerJoin(users, eq(tournaments.organizerId, users.id))
    .orderBy(desc(tournaments.date));

    return result.map(row => ({
      ...row,
      organizer: { name: row.organizerName }
    }));
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const [tournament] = await db.insert(tournaments).values(insertTournament).returning();
    return tournament;
  }

  async updateTournamentResults(results: { enrollmentId: number, score: number, rank: number }[]): Promise<void> {
    // Transaction ideally, but looping for now
    for (const res of results) {
      await db.update(enrollments)
        .set({ score: res.score, rank: res.rank })
        .where(eq(enrollments.id, res.enrollmentId));
    }
  }

  // Enrollments
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(insertEnrollment).returning();
    return enrollment;
  }

  async getEnrollmentsByTournament(tournamentId: number): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.tournamentId, tournamentId));
  }

  // Rankings (Mock simple calculation)
  async getRankings(): Promise<{ birdName: string, ownerName: string, totalScore: number, species: string }[]> {
    // This is a simplified ranking query. In a real app, this would be more complex SQL.
    // Summing scores from enrollments.
    const result = await db.select({
      birdName: birds.name,
      ownerName: users.name,
      species: birds.species,
      totalScore: sql<number>`sum(${enrollments.score})`.mapWith(Number)
    })
    .from(enrollments)
    .innerJoin(birds, eq(enrollments.birdId, birds.id))
    .innerJoin(users, eq(birds.ownerId, users.id))
    .groupBy(birds.id, users.id, birds.name, users.name, birds.species)
    .orderBy(desc(sql`sum(${enrollments.score})`))
    .limit(50);
    
    return result;
  }
}

export const storage = new DatabaseStorage();
