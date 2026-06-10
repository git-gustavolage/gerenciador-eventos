import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/Inputs/InputError';
import InputLabel from '@/Components/Inputs/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { WarningCircle } from '@phosphor-icons/react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                    <WarningCircle size={24} weight="bold" />
                    Excluir Conta
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                    Uma vez que sua conta for excluída, todos os recursos e dados (incluindo certificados e inscrições) serão apagados permanentemente. Se você for organizador, perderá o acesso aos seus eventos.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Excluir Minha Conta</DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">
                        Tem certeza que deseja excluir sua conta?
                    </h2>
                    <p className="text-sm text-neutral-600 mb-6">
                        Por favor, digite sua senha para confirmar que você deseja excluir permanentemente sua conta. <strong>Esta ação não pode ser desfeita.</strong>
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Senha" className="sr-only" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                            placeholder="Digite sua senha"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <DangerButton disabled={processing}>Confirmar Exclusão</DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}