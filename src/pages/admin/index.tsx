import { Categories } from "@/types/category";
import { useQuery } from "react-query";
import axios from "axios";
import Link from "next/link";

const AdminPage = () => {
  const { data: categories } = useQuery<Categories>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<Categories>("http://localhost:5000/api/v1/categories");
      const data = response.data;

      return data;
    },
  });

  return (
    <div>
      <div>
        {categories?.map((category) => {
          return (
            <Link
              key={category._id}
              href={`/admin/${category._id}`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPage;
