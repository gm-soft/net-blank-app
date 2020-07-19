export abstract class BaseModel<TModel> {
  constructor(data?: Partial<TModel>) {
    if (data != null) {
      Object.assign(this, data);
    }
  }

  id: number;
  createdAt: Date;
  updatedAt: Date;
}
