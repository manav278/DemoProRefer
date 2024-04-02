import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

async function initCounter(sequenceName) {
  await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $setOnInsert: { sequence_value: 0 } },
    { upsert: true }
  );
}

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}

export default Counter;
export { initCounter, getNextSequenceValue };
