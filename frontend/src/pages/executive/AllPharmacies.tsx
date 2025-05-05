import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  Table,
  Button,
  Group,
  TextInput,
  Modal,
  LoadingOverlay,
  Alert,
  Select,
  Text,
} from '@mantine/core';
import { pharmacyService, Pharmacy } from '../../services/pharmacyService';
import { reportService } from '../../services/reportService';

export function AllPharmacies() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lgaFilter, setLgaFilter] = useState<string | null>('All');
  const [wardFilter, setWardFilter] = useState<string | null>('All');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [pharmacyReports, setPharmacyReports] = useState<any[]>([]);

  // Get unique LGAs and wards for filtering
  const getLGAs = () => {
    const lgas = new Set<string>();
    pharmacies.forEach((pharmacy) => {
      lgas.add(pharmacy.lga);
    });
    return ['All', ...Array.from(lgas)];
  };

  const getWards = () => {
    const wards = new Set<string>();
    pharmacies.forEach((pharmacy) => {
      wards.add(pharmacy.ward);
    });
    return ['All', ...Array.from(wards)];
  };

  // Fetch pharmacies
  useEffect(() => {
    const fetchPharmacies = async () => {
      setLoading(true);
      try {
        const data = await pharmacyService.getAllPharmacies();
        setPharmacies(data);
        setFilteredPharmacies(data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load pharmacies');
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  // Filter pharmacies based on search term, LGA, and ward
  useEffect(() => {
    let filtered = [...pharmacies];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (pharmacy) =>
          pharmacy.name.toLowerCase().includes(search) ||
          pharmacy.pharmacistInCharge.toLowerCase().includes(search) ||
          pharmacy.lga.toLowerCase().includes(search) ||
          pharmacy.ward.toLowerCase().includes(search)
      );
    }

    // Apply LGA filter
    if (lgaFilter && lgaFilter !== 'All') {
      filtered = filtered.filter((pharmacy) => pharmacy.lga === lgaFilter);
    }

    // Apply ward filter
    if (wardFilter && wardFilter !== 'All') {
      filtered = filtered.filter((pharmacy) => pharmacy.ward === wardFilter);
    }

    setFilteredPharmacies(filtered);
  }, [pharmacies, searchTerm, lgaFilter, wardFilter]);

  // View pharmacy details
  const handleViewPharmacy = async (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setViewModalOpen(true);

    try {
      // Fetch reports for this pharmacy
      const reports = await reportService.getReportsByPharmacy(pharmacy.id);
      setPharmacyReports(reports);
    } catch (error: any) {
      setError(
        error.response?.data?.message || 'Failed to load pharmacy reports'
      );
    }
  };

  return (
    <div>
      <Title order={2} mb="lg">
        All Pharmacies
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Group mb="md">
        <TextInput
          placeholder="Search pharmacies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder="Filter by LGA"
          data={getLGAs()}
          value={lgaFilter}
          onChange={setLgaFilter}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filter by Ward"
          data={getWards()}
          value={wardFilter}
          onChange={setWardFilter}
          style={{ width: 200 }}
        />
      </Group>

      <Paper withBorder pos="relative">
        <LoadingOverlay visible={loading} />

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Ward</Table.Th>
              <Table.Th>LGA</Table.Th>
              <Table.Th>Pharmacist</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredPharmacies.length > 0 ? (
              filteredPharmacies.map((pharmacy) => (
                <Table.Tr key={pharmacy.id}>
                  <Table.Td>{pharmacy.name}</Table.Td>
                  <Table.Td>{pharmacy.ward}</Table.Td>
                  <Table.Td>{pharmacy.lga}</Table.Td>
                  <Table.Td>{pharmacy.pharmacistInCharge}</Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleViewPharmacy(pharmacy)}
                      >
                        View
                      </Button>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                  {loading ? 'Loading...' : 'No pharmacies found'}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pharmacy Details Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPharmacy(null);
        }}
        title={<Title order={3}>{selectedPharmacy?.name}</Title>}
        size="lg"
      >
        {selectedPharmacy && (
          <div>
            <Paper withBorder p="md" mb="md">
              <Title order={4} mb="md">
                Pharmacy Information
              </Title>
              <Text>
                <strong>Name:</strong> {selectedPharmacy.name}
              </Text>
              <Text>
                <strong>Pharmacist in Charge:</strong>{' '}
                {selectedPharmacy.pharmacistInCharge}
              </Text>
              <Text>
                <strong>PCN License Number:</strong>{' '}
                {selectedPharmacy.pcnLicenseNumber}
              </Text>
              <Text>
                <strong>Phone Number:</strong> {selectedPharmacy.phoneNumber}
              </Text>
              <Text>
                <strong>Email:</strong> {selectedPharmacy.email || 'N/A'}
              </Text>
              <Text>
                <strong>Address:</strong> {selectedPharmacy.address}
              </Text>
              <Text>
                <strong>Ward:</strong> {selectedPharmacy.ward}
              </Text>
              <Text>
                <strong>LGA:</strong> {selectedPharmacy.lga}
              </Text>
            </Paper>

            <Paper withBorder p="md">
              <Title order={4} mb="md">
                Report Summary
              </Title>
              {pharmacyReports.length > 0 ? (
                <>
                  <Text>
                    <strong>Total Reports:</strong> {pharmacyReports.length}
                  </Text>
                  <Text>
                    <strong>Last Report Date:</strong>{' '}
                    {new Date(
                      pharmacyReports[0].reportDate
                    ).toLocaleDateString()}
                  </Text>
                  <Text>
                    <strong>Total Patients Served:</strong>{' '}
                    {pharmacyReports.reduce(
                      (sum, report) => sum + report.patientsServed,
                      0
                    )}
                  </Text>
                </>
              ) : (
                <Text c="dimmed">No reports submitted yet</Text>
              )}
            </Paper>
          </div>
        )}
      </Modal>
    </div>
  );
}
