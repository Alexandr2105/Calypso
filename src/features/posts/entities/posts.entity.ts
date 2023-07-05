export class PostsEntity {
  id: string;
  userId: string;
  description?: string;

  constructor(id: string, userId: string, description: string) {
    (this.id = id), (this.userId = userId), (this.description = description);
  }
}
