export class PostsEntity {
  id: string;
  userId: string;
  description?: string;
  createdAt: Date;

  constructor(
    id: string,
    userId: string,
    description: string,
    createdAt: Date,
  ) {
    this.id = id;
    this.userId = userId;
    this.description = description;
    this.createdAt = createdAt;
  }
}
