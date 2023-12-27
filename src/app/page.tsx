'use client'

import { useForm } from "react-hook-form"
import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { createClients, deleteClient, fetchClients, updateClients } from '../actions/actionsClients';
import { TrashIcon, PencilIcon } from '@heroicons/react/outline';

interface Client {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
}

const ClientPage: NextPage = () => {
  const [clients, setClients] = useState([] as any);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const fetchClientsData = async () => {
    try {
      const clientsData = await fetchClients(); // Llama a la función que obtiene los clientes del servidor
      setClients(clientsData); // Actualiza el estado con los clientes obtenidos
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  useEffect(() => {
    // Carga inicial de clientes si existen
    fetchClientsData();
  }, []);


  const onSubmit = handleSubmit(async (data: any) => {
    try {
      const clientsData = await createClients(data);
      console.log(clientsData);

      console.log('Cliente creado:', clientsData);
      setClients([...clients, clientsData]);

    } catch (error) {
      console.error('Error:', error);
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Client
  ) => {
    if (selectedClient) {
      setSelectedClient({
        ...selectedClient,
        [field]: e.target.value,
      });
    }
  };

  const handleModify = (client: Client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedClient(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      if (selectedClient && clients.length > 0 && clients) {
        const updatedClient = await updateClients(selectedClient);
        console.log('Cliente actualizado:', updatedClient);
        if ('id' in updatedClient) {
          // Actualiza el estado con el cliente actualizado
          const updatedClients = clients.map((existingClient: Client) =>
            existingClient.id === updatedClient.id ? updatedClient : existingClient
          );
          setClients(updatedClients);
        }
        // Cierra el modal después de guardar los cambios
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al actualizar el cliente:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (id) {
        const deleltedClient = await deleteClient(id);
        alert('cliente eliminado')
        setClients([...clients]);
        // Cierra el modal después de guardar los cambios
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    }
  };


  return (
    <div className="relative min-h-screen bg-gray-100 flex justify-center items-center flex-col">
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Agregar cliente</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <input
              type="text"
              {...register("nombre", {
                required: { value: true, message: "Nombre es requerido" },
              })}
              className="input-field"
              placeholder="Nombre"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              {...register("apellido", {
                required: { value: true, message: "Apellido es requerido" },
              })}
              className="input-field"
              placeholder="Apellido"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              {...register("dni", {
                required: { value: true, message: "DNI es requerido" },
              })}
              className="input-field"
              placeholder="DNI"
            />
          </div>
          <button type="submit" className="btn-primary">
            Agregar
          </button>
        </form>
      </div>
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Ver clientes</h2>
        <table className="border-collapse border w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">DNI</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients && clients.length > 0 && clients.map((client: Client) => (
              <tr key={client.id} className="border-b">
                <td className="p-2">{client.nombre}</td>
                <td className="p-2">{client.apellido}</td>
                <td className="p-2">{client.dni}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleModify(client)}
                    className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                    title="Modificar"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-4 h-4 " /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && selectedClient && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-8 w-96">
            <button
              className="float-right text-gray-600 cursor-pointer"
              onClick={handleCloseModal}
            >
              Cerrar
            </button>
            <h2 className="text-2xl font-bold mb-4">Modificar cliente</h2>
            <form>

              <div className="mb-4">
                <input
                  type="text"
                  value={selectedClient.nombre}
                  onChange={(e) => handleInputChange(e, 'nombre')}
                  className="input-field"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  value={selectedClient.apellido}
                  onChange={(e) => handleInputChange(e, 'apellido')}
                  className="input-field"
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  value={selectedClient.dni}
                  onChange={(e) => handleInputChange(e, 'dni')}
                  className="input-field"
                />
              </div>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
