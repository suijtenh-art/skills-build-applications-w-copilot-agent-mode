import mongoose from 'mongoose';
import { Activity } from '../models/Activity';
import { Leaderboard } from '../models/Leaderboard';
import { Team } from '../models/Team';
import { User } from '../models/User';
import { Workout } from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const [ava, noah, mila] = await User.create([
      {
        name: 'Ava de Vries',
        email: 'ava@example.com',
        passwordHash: 'seeded-password-hash',
        avatarUrl: 'https://i.pravatar.cc/150?img=47',
      },
      {
        name: 'Noah Jansen',
        email: 'noah@example.com',
        passwordHash: 'seeded-password-hash',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
      },
      {
        name: 'Mila Smit',
        email: 'mila@example.com',
        passwordHash: 'seeded-password-hash',
        avatarUrl: 'https://i.pravatar.cc/150?img=32',
      },
    ]);

    await Team.create({
      name: 'Octofit Pioneers',
      description: 'A team building consistent fitness habits together.',
      members: [ava._id, noah._id, mila._id],
    });

    await Activity.create([
      {
        user: ava._id,
        type: 'Running',
        durationMinutes: 42,
        caloriesBurned: 410,
        completedAt: new Date('2026-08-22T07:30:00Z'),
      },
      {
        user: noah._id,
        type: 'Cycling',
        durationMinutes: 55,
        caloriesBurned: 530,
        completedAt: new Date('2026-08-23T09:00:00Z'),
      },
      {
        user: mila._id,
        type: 'Strength training',
        durationMinutes: 38,
        caloriesBurned: 320,
        completedAt: new Date('2026-08-23T18:15:00Z'),
      },
    ]);

    await Leaderboard.create([
      { user: noah._id, points: 1280, rank: 1 },
      { user: ava._id, points: 1140, rank: 2 },
      { user: mila._id, points: 980, rank: 3 },
    ]);

    await Workout.create([
      {
        title: 'Morning Momentum',
        description: 'A quick full-body session to start the day with energy.',
        difficulty: 'beginner',
        durationMinutes: 25,
        exercises: ['Bodyweight squats', 'Push-ups', 'Plank'],
      },
      {
        title: 'Endurance Builder',
        description: 'A balanced interval workout for improving cardiovascular fitness.',
        difficulty: 'intermediate',
        durationMinutes: 45,
        exercises: ['Jogging intervals', 'Walking recovery', 'Cool-down stretches'],
      },
      {
        title: 'Power Circuit',
        description: 'A challenging circuit that develops strength and conditioning.',
        difficulty: 'advanced',
        durationMinutes: 60,
        exercises: ['Burpees', 'Kettlebell swings', 'Mountain climbers'],
      },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
