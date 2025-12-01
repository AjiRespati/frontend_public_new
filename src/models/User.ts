// models/User.ts

export type UserRole = "admin" | "cashier" | string;

export class User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;

  constructor(id: string, name: string, email: string, role: UserRole = "user", avatar?: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.role = role;
  }

  static fromJson(json: any): User {
    return new User(json.id, json.name, json.email, json.role, json.avatar);
  }

  toJson(): Record<string, any> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      avatar: this.avatar,
    };
  }

  get initials(): string {
    return this.name
      ? this.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "?";
  }

  isAdmin(): boolean {
    return this.role === "admin";
  }

  displayName(): string {
    return this.name || this.email || "Anonymous";
  }
}
