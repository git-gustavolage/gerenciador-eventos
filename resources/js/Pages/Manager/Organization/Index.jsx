import DefaultLayout from "@/Layouts/DefaultLayout";
import Sidebar from "./Components/Sidebar";

export default function Index() {

    return (
        <DefaultLayout title={''}>
            <Sidebar />

            <p>Manager/Organizacoes</p>
        </DefaultLayout>
    )
}
