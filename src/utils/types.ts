import { Types } from "mongoose";

export interface IStaff extends Document {
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName?: string;
    gender?: string;
    email: string;
    phone: string;
    dob: Date;
    state: string;
    lga?: string;
    address?: string;
  };
  roleId: string;
  workDetails: {
    bankName: string;
    accountNumber: string;
    employmentType: string;
    dateOfEmployment: Date;
    salary: number;
  };
  documents: {
    type: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  }[];
  status: "active" | "inactive" | "suspended" | "no-password";
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}


export interface IAuth {
  username: string;
  password: string;
  userId: Types.ObjectId;
  userType: "agent" | "director" | "manager";
  status: "active" | "disabled";
  lastLoginAt?: Date;
}


export interface ICustomer {
  personalDetails?: {
    firstName: string;
    lastName: string;
    middleName: String,
    gender: String,
    phone: string;
    email?: string;
    state: string;
    residential: string;
    lga: string;
  };
  businessDetails?: {
    employmentType: string;
    occupation: string;
    monthlyIncome?: string;
    businessName?: string;
    workAddress: string;
    yearInBusiness?: string;
  };
  guarantorDetails?: {
    fullName: string;
    phone: string;
    address: string;
    relationship: string;
  }[];
  documentDetails?: {
    type: string;
    fileName: string;
    fileUrl: string;
  }[];
  status: "active" | "blacklisted" | "inactive";
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
}

export interface IProduct {
  productDetails: {
    name: string;
    interestRate: number;
    durationInMonths: number;
    minAmount: number;
    maxAmount: number;
    penaltyRate: number;
    minTenure: number;
    maxTenure: number;
    gracePeriod: number;
    repaymentFrequency: string;
    collateral: boolean;
  };
  status: "active" | "inactive";
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  createdAt?: Date,
  updatedAt?: Date
}

