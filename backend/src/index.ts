import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import flightRoutes from "./routes/flights";
import hotelRoutes from "./routes/hotels";
import transferRoutes from "./routes/transfers";
import activityRoutes from './routes/activities';
import insightRoutes from './routes/insights';
import tripRoutes from './routes/trip';
import aiRoutes from './routes/ai';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/flights", flightRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/transfers", transferRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/trip', tripRoutes);
app.use('/api/ai', aiRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
