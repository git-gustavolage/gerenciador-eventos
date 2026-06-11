import { Head } from '@inertiajs/react';
import Navbar from "@/Layouts/Common/Navbar";
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';
import { UserCircle } from '@phosphor-icons/react';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <div className="min-h-screen bg-neutral-50">
            <Head title="Meu Perfil" />
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
                        <UserCircle size={36} className="text-emerald-600" weight="duotone" />
                        Meu Perfil
                    </h1>
                    <p className="text-neutral-500 mt-2 text-lg">
                        Gerencie suas informações pessoais, senha e segurança da conta.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 shadow-sm border border-neutral-200 sm:rounded-2xl">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="bg-white p-6 shadow-sm border border-neutral-200 sm:rounded-2xl">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="bg-white p-6 shadow-sm border border-red-100 sm:rounded-2xl">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}