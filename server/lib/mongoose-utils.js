export const documentTransform = {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

export const defaultSchemaOptions = {
  timestamps: true,
  toJSON: documentTransform,
  toObject: documentTransform,
};
