import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(), // email or phone
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["criador", "organizador", "admin"] }).default("criador").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const birds = pgTable("birds", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  species: text("species").notNull(), // Coleiro, Papa-capim, Trinca-ferro, etc.
  ringNumber: text("ring_number"), // Anilha
  photoUrl: text("photo_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  birdId: integer("bird_id").notNull().references(() => birds.id),
  date: timestamp("date").defaultNow().notNull(),
  type: text("type").notNull(), // Velocidade, Resistência, Livre
  duration: integer("duration").notNull(), // em minutos ou segundos
  songCount: integer("song_count").default(0),
  notes: text("notes"),
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  organizerId: integer("organizer_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  description: text("description"), // Regras, etc.
  entryFee: integer("entry_fee").default(0), // Valor em centavos
  prizes: jsonb("prizes"), // Lista de premiações
  status: text("status", { enum: ["aberto", "fechado", "concluido"] }).default("aberto"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id),
  birdId: integer("bird_id").notNull().references(() => birds.id),
  paid: boolean("paid").default(false),
  score: integer("score").default(0), // Cantos
  rank: integer("rank"), // Classificação final
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const usersRelations = relations(users, ({ many }) => ({
  birds: many(birds),
  tournaments: many(tournaments),
}));

export const birdsRelations = relations(birds, ({ one, many }) => ({
  owner: one(users, {
    fields: [birds.ownerId],
    references: [users.id],
  }),
  trainings: many(trainings),
  enrollments: many(enrollments),
}));

export const tournamentsRelations = relations(tournaments, ({ one, many }) => ({
  organizer: one(users, {
    fields: [tournaments.organizerId],
    references: [users.id],
  }),
  enrollments: many(enrollments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  tournament: one(tournaments, {
    fields: [enrollments.tournamentId],
    references: [tournaments.id],
  }),
  bird: one(birds, {
    fields: [enrollments.birdId],
    references: [birds.id],
  }),
}));


// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBirdSchema = createInsertSchema(birds).omit({ id: true, createdAt: true });
export const insertTrainingSchema = createInsertSchema(trainings).omit({ id: true });
export const insertTournamentSchema = createInsertSchema(tournaments).omit({ id: true, createdAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, createdAt: true });


// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bird = typeof birds.$inferSelect;
export type InsertBird = z.infer<typeof insertBirdSchema>;

export type Training = typeof trainings.$inferSelect;
export type InsertTraining = z.infer<typeof insertTrainingSchema>;

export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
