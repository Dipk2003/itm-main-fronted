import React, { useState, useEffect } from 'react';
import clientAPI from '@/services/clientApi';
import {
  Client,
  ClientFormData,
  ClientStatus,
  PaginatedResponse,
  ClientType,
} from '@/types/legal';

const ClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Client> = await clientAPI.getAllClients({ page: 0, size: 20 });
      setClients(response.content);
    } catch (err) {
      setError('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientAPI.deleteClient(id);
      fetchClients();
    } catch (err) {
      setError('Failed to delete client');
    }
  };

  return (
    <div>
      <h2>Client Management</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.firstName} {client.lastName}</td>
                <td>{client.email}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.status}</td>
                <td>
                  <button onClick={() => handleDeleteClient(client.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientManagement;

