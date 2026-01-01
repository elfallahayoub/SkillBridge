const connectDB = require('../config/db');
const Project = require('../models/Project');
const User = require('../models/User');
require('dotenv').config();

async function main() {
  await connectDB();

  const ownerArg = process.argv.find(a => a.startsWith('--owner='));
  const ownerId = ownerArg ? ownerArg.split('=')[1] : process.env.MIGRATE_OWNER_ID;

  const projects = await Project.find().lean();
  console.log(`Found ${projects.length} projects`);

  let updated = 0;

  for (const p of projects) {
    const updates = {};

    // Normalize members when stored as string (JSON or CSV)
    if (p.members && typeof p.members === 'string') {
      let arr;
      try {
        const parsed = JSON.parse(p.members);
        if (Array.isArray(parsed)) arr = parsed;
        else arr = String(parsed).split(',').map(s => s.trim()).filter(Boolean);
      } catch (e) {
        arr = p.members.split(',').map(s => s.trim()).filter(Boolean);
      }
      updates.members = arr;
    }

    // If members is not an array but exists, coerce to array
    if (p.members && !Array.isArray(p.members)) {
      updates.members = [p.members];
    }

    // Set owner if missing and ownerId provided
    if ((!p.owner || p.owner === null || p.owner === '') && ownerId) {
      updates.owner = ownerId;
    }

    if (Object.keys(updates).length > 0) {
      await Project.findByIdAndUpdate(p._id, updates, { new: true });
      updated++;
      console.log(`Updated project ${p._id}:`, updates);
    }
  }

  console.log(`Migration complete. Updated ${updated}/${projects.length} projects.`);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
