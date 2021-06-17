import * as mongoose from 'mongoose';

export interface Template extends mongoose.Document {
  name: string;
  header: {
    img: string;
    title: string;
    description: string;
    mainButton: string;
  };
  colorChart: Record<string, any>;
  colorChartOptions: [Record<string, any>];
  font: string;
  fontOptions: [string];
  isDeleted: boolean;
  deletedAt: Date | null;
}
