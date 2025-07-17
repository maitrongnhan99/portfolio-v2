import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IKnowledgeChunk extends Document {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    category: 'personal' | 'skills' | 'experience' | 'projects' | 'education' | 'contact';
    priority: 1 | 2 | 3;
    tags: string[];
    source: string;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeChunkSchema = new Schema<IKnowledgeChunk>({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  embedding: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v: number[]) {
        return v.length === 768; // text-embedding-004 dimensions
      },
      message: 'Embedding must have exactly 768 dimensions'
    }
  },
  metadata: {
    category: {
      type: String,
      enum: ['personal', 'skills', 'experience', 'projects', 'education', 'contact'],
      required: true,
    },
    priority: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
      default: 2,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    source: {
      type: String,
      required: true,
      trim: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
});

// Create indexes for efficient querying
KnowledgeChunkSchema.index({ 'metadata.category': 1 });
KnowledgeChunkSchema.index({ 'metadata.priority': 1 });
KnowledgeChunkSchema.index({ 'metadata.tags': 1 });

// Text search index for fallback searching
KnowledgeChunkSchema.index({ 
  content: 'text',
  'metadata.tags': 'text' 
});

// For MongoDB Atlas Vector Search, the vector index is created separately in Atlas
// Index name: "knowledge_vector_index"
// Index definition:
// {
//   "fields": [
//     {
//       "type": "vector",
//       "path": "embedding",
//       "numDimensions": 768,
//       "similarity": "cosine"
//     },
//     {
//       "type": "filter", 
//       "path": "metadata.category"
//     },
//     {
//       "type": "filter", 
//       "path": "metadata.priority"
//     }
//   ]
// }

const KnowledgeChunk: Model<IKnowledgeChunk> = 
  mongoose.models.KnowledgeChunk || 
  mongoose.model<IKnowledgeChunk>('KnowledgeChunk', KnowledgeChunkSchema);

export default KnowledgeChunk;