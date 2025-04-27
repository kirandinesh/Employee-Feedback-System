export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface AddEmployeeRegister {
  username: string;
  role: string;
  email: string;
  password: string;
}

export interface Employee {
  _id: string;
  email: string;
  username: string;
  role: string;
}

export interface AssignedReview {
  email: string;
  recipientId?: string;
}

export interface Feedback {
  reviewerEmail: string;
  review: string;
  reviewId?: string;
}
