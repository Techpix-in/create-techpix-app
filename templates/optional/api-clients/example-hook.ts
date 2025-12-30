import { useQuery } from "@tanstack/react-query";
import { getUsers, getUserById } from "@/services/user-service";

export const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });
};

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
};
