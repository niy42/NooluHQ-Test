export interface Signup {
  id: string;
  name: string;
  email: string;
  plan: string;
  joined: string;
  status: "Active" | "Inactive" | "Trial";
}

export const rows: Signup[] = [
  {
    id: "1",
    name: "Adebanjo Promise",
    email: "adebanjo@gmail.com",
    plan: "Free",
    joined: "3 days ago",
    status: "Trial",
  },
  {
    id: "2",
    name: "Bisi Johnson",
    email: "johnbisi@gmail.com",
    plan: "Free",
    joined: "12 days ago",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Musa Philips",
    email: "philips23@gmail.com",
    plan: "Free",
    joined: "30 days ago",
    status: "Active",
  },
];

export const revenueChartData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4000 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 7000 },
];
export const plansChartData = [
  { name: "Free", users: 400 },
  { name: "Pro", users: 300 },
  { name: "Business", users: 200 },
];

export const userDistributionData = [
  { name: "Nigeria", value: 40 },
  { name: "USA", value: 30 },
  { name: "UK", value: 20 },
  { name: "Others", value: 10 },
];

export const COLORS = ["#3B82F6", "#6366F1", "#22C55E", "#F59E0B"];

export const getStatusColor = (status: Signup["status"]) => {
  switch (status) {
    case "Active":
      return "success";
    case "Inactive":
      return "default";
    case "Trial":
      return "warning";
  }
};
