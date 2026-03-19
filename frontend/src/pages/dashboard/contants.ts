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
