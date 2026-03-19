import ReusableTable, { type TableColumn } from "@/components/Table/Table";
import { Avatar, Typography } from "@mui/material";
import { rows, type Signup } from "../../contants";
import { StatusCell } from "@/components/constants";

export default function LatestSignups() {
  const columns: TableColumn<Signup>[] = [
    {
      field: "name",
      headerName: "Name",
      render: (row: Signup) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar>{row.name.charAt(0)}</Avatar>
          <Typography variant="body2">{row.name}</Typography>
        </div>
      ),
    },
    { field: "email", headerName: "Email" },
    { field: "plan", headerName: "Plan" },
    { field: "joined", headerName: "Joined" },
    {
      field: "status",
      headerName: "Status",
      render: (row: Signup) => (
        <StatusCell status={row.status} />
        // <Chip
        //   label={row.status}
        //   color={getStatusColor(row.status)}
        //   size="small"
        // />
      ),
    },
  ];

  return (
    <div className="h-auto rounded-xl bg-white px-6 py-12">
      <h2 className="mb-4 text-lg font-semibold">Latest Signups</h2>

      <ReusableTable columns={columns} rows={rows} getRowId={(row) => row.id} />
    </div>
  );
}
