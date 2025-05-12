import { useState, useEffect } from 'react';
import {
  Title,
  Paper,
  NumberInput,
  Button,
  Group,
  Divider,
  Textarea,
  Switch,
  MultiSelect,
  Grid,
  Alert,
  LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useAuthStore } from '../../store/authStore';
import {
  reportService,
  ReportCreateRequest,
} from '../../services/reportService';
import { fdaService } from '../../services/fdaService';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

export function SubmitReport() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [ailments, setAilments] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState<ReportCreateRequest>({
    reportDate: new Date(),
    patientsServed: 0,
    maleCount: 0,
    femaleCount: 0,
    childrenCount: 0,
    adultCount: 0,
    elderlyCount: 0,
    topMedications: [],
    commonAilments: [],
    adverseDrugReactions: 0,
    adverseReactionDetails: '',
    referralsMade: 0,
    immunizationsGiven: 0,
    healthEducationSessions: 0,
    bpChecks: 0,
    expiredDrugs: false,
    stockouts: false,
    supplyDelays: false,
    notes: '',

    // Service Delivery Data
    prescriptionsFilled: 0,
    otcConsultations: 0,
    mtmInterventions: 0,

    // Economic Contribution
    monthlyRevenue: 0,
    staffPharmacists: 0,
    staffTechnicians: 0,
    staffOthers: 0,
    taxesPaid: 0,
    localSuppliersCount: 0,

    // Challenges and Barriers
    regulatoryComplianceCost: 0,
    hasSubsidizedMedicines: false,
    insuranceInclusionIssues: false,
    fakeOrSubstandardDrugs: 0,
    rejectedInsuranceClaims: 0,

    // Public Health Role
    publicHealthPartnerships: [],

    // Technology and Digital Adoption
    usesElectronicRecords: false,
    usesMobileHealth: false,
    usesInventoryManagement: false,

    // Community Feedback
    patientSatisfactionScore: 0,
    timeComparedToHospital: 0,
  });

  // Fetch medications and ailments data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch medications and ailments in parallel for better performance
        console.log('Fetching medications and ailments...');
        const [medicationsData, ailmentsData] = await Promise.all([
          fdaService.getMedications(),
          fdaService.getAilments(),
        ]);

        setMedications(medicationsData);
        setAilments(ailmentsData);

        console.log(
          `Loaded ${medicationsData.length} medications and ${ailmentsData.length} ailments`
        );
      } catch (error) {
        console.error('Error in medications/ailments fetch operation:', error);
        // The fdaService already handles errors and returns default values,
        // so we shouldn't reach this code unless there's a serious issue
        setError(
          'Warning: Using default medications and ailments data due to connection issues'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Check if user is authenticated and has a pharmacy ID
  useEffect(() => {
    if (!user || !user.pharmacyId) {
      setError('You must be logged in as a pharmacy to submit reports');
    }
  }, [user]);

  // Check for saved report data in localStorage
  useEffect(() => {
    try {
      const savedReport = localStorage.getItem('pendingReport');
      if (savedReport) {
        const parsedReport = JSON.parse(savedReport);

        // Ask user if they want to restore the saved report
        if (
          window.confirm(
            'We found a previously unsaved report. Would you like to restore it?'
          )
        ) {
          setFormData(parsedReport);
          console.log('Restored report data from localStorage');
        }

        // Remove the saved report after restoring or declining
        localStorage.removeItem('pendingReport');
      }
    } catch (error) {
      console.error('Error checking for saved reports:', error);
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (
    field: keyof ReportCreateRequest,
    value: string | number | boolean | Date | string[] | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.pharmacyId) {
      setError('You must be logged in as a pharmacy to submit reports');
      return;
    }

    // Validate required fields
    if (!formData.reportDate) {
      setError('Report date is required');
      return;
    }

    if (formData.patientsServed <= 0) {
      setError('Number of patients served must be greater than 0');
      return;
    }

    if (formData.topMedications.length === 0) {
      setError('Please select at least one medication');
      return;
    }

    if (formData.commonAilments.length === 0) {
      setError('Please select at least one ailment');
      return;
    }

    setLoading(true);
    setError('');

    console.log('Submitting form data:', formData);
    console.log('User pharmacyId:', user.pharmacyId);

    try {
      // Make sure the form data is properly formatted
      const cleanedData = {
        ...formData,
        // Ensure numeric fields are numbers, not strings
        patientsServed: Number(formData.patientsServed),
        maleCount: Number(formData.maleCount || 0),
        femaleCount: Number(formData.femaleCount || 0),
        childrenCount: Number(formData.childrenCount || 0),
        adultCount: Number(formData.adultCount || 0),
        elderlyCount: Number(formData.elderlyCount || 0),
        adverseDrugReactions: Number(formData.adverseDrugReactions || 0),
        referralsMade: Number(formData.referralsMade || 0),

        // New fields
        prescriptionsFilled: Number(formData.prescriptionsFilled || 0),
        otcConsultations: Number(formData.otcConsultations || 0),
        mtmInterventions: Number(formData.mtmInterventions || 0),
        monthlyRevenue: Number(formData.monthlyRevenue || 0),
        staffPharmacists: Number(formData.staffPharmacists || 0),
        staffTechnicians: Number(formData.staffTechnicians || 0),
        staffOthers: Number(formData.staffOthers || 0),
        taxesPaid: Number(formData.taxesPaid || 0),
        localSuppliersCount: Number(formData.localSuppliersCount || 0),
        regulatoryComplianceCost: Number(
          formData.regulatoryComplianceCost || 0
        ),
        fakeOrSubstandardDrugs: Number(formData.fakeOrSubstandardDrugs || 0),
        rejectedInsuranceClaims: Number(formData.rejectedInsuranceClaims || 0),
        patientSatisfactionScore: Number(
          formData.patientSatisfactionScore || 0
        ),
        timeComparedToHospital: Number(formData.timeComparedToHospital || 0),
      };

      // Set a timeout for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await reportService.createReport(cleanedData);
        clearTimeout(timeoutId);
        console.log('Report submitted successfully:', response);
        setSubmitted(true);
      } catch (submitError) {
        clearTimeout(timeoutId);
        throw submitError; // Re-throw to be caught by the outer catch
      }
    } catch (error) {
      console.error('Error submitting report:', error);

      // Handle different error types
      if (error.name === 'AbortError') {
        setError(
          'Request timed out. The server might be unavailable. Please try again later.'
        );
      } else if (typeof error === 'string') {
        setError(error);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to submit report. Please try again.');
      }

      // Store report data in localStorage as a backup
      try {
        localStorage.setItem('pendingReport', JSON.stringify(formData));
        console.log('Report data saved to localStorage as backup');
      } catch (storageError) {
        console.error('Failed to save report to localStorage:', storageError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      reportDate: new Date(),
      patientsServed: 0,
      maleCount: 0,
      femaleCount: 0,
      childrenCount: 0,
      adultCount: 0,
      elderlyCount: 0,
      topMedications: [],
      commonAilments: [],
      adverseDrugReactions: 0,
      adverseReactionDetails: '',
      referralsMade: 0,
      immunizationsGiven: 0,
      healthEducationSessions: 0,
      bpChecks: 0,
      expiredDrugs: false,
      stockouts: false,
      supplyDelays: false,
      notes: '',

      // Service Delivery Data
      prescriptionsFilled: 0,
      otcConsultations: 0,
      mtmInterventions: 0,

      // Economic Contribution
      monthlyRevenue: 0,
      staffPharmacists: 0,
      staffTechnicians: 0,
      staffOthers: 0,
      taxesPaid: 0,
      localSuppliersCount: 0,

      // Challenges and Barriers
      regulatoryComplianceCost: 0,
      hasSubsidizedMedicines: false,
      insuranceInclusionIssues: false,
      fakeOrSubstandardDrugs: 0,
      rejectedInsuranceClaims: 0,

      // Public Health Role
      publicHealthPartnerships: [],

      // Technology and Digital Adoption
      usesElectronicRecords: false,
      usesMobileHealth: false,
      usesInventoryManagement: false,

      // Community Feedback
      patientSatisfactionScore: 0,
      timeComparedToHospital: 0,
    });
  };

  if (submitted) {
    return (
      <div>
        <Title order={2} mb="lg">
          Submit Monthly Report
        </Title>
        <Alert color="green" title="Success!" mb="xl">
          Your monthly report has been submitted successfully.
        </Alert>
        <Group>
          <Button onClick={() => setSubmitted(false)}>
            Submit Another Report
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/pharmacy/my-reports')}
          >
            View My Reports
          </Button>
        </Group>
      </div>
    );
  }

  return (
    <div>
      <Title order={2} mb="lg">
        Submit Monthly Report
      </Title>

      {error && (
        <Alert color="red" mb="xl" withCloseButton onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper withBorder p="md" pos="relative">
        <LoadingOverlay visible={loading} />

        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Report Date"
                placeholder="Select date"
                required
                mb="md"
                value={formData.reportDate}
                onChange={(value) => handleInputChange('reportDate', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Total Patients Served"
                placeholder="Enter number"
                required
                min={0}
                mb="md"
                value={formData.patientsServed}
                onChange={(value) => handleInputChange('patientsServed', value)}
              />
            </Grid.Col>
          </Grid>

          <Divider
            my="md"
            label="Patient Demographics"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Male Patients"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.maleCount}
                onChange={(value) => handleInputChange('maleCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Female Patients"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.femaleCount}
                onChange={(value) => handleInputChange('femaleCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Children (0-12 years)"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.childrenCount}
                onChange={(value) => handleInputChange('childrenCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Adults (13-59 years)"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.adultCount}
                onChange={(value) => handleInputChange('adultCount', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Elderly (60+ years)"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.elderlyCount}
                onChange={(value) => handleInputChange('elderlyCount', value)}
              />
            </Grid.Col>
          </Grid>

          <Divider
            my="md"
            label="Medications & Ailments"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Top Medications Dispensed"
                placeholder="Select medications"
                data={medications.map((med) => ({ value: med, label: med }))}
                searchable
                withAsterisk
                mb="md"
                value={formData.topMedications}
                onChange={(value) => {
                  // Handle new items
                  const newItems = value.filter(
                    (item) => !medications.includes(item)
                  );
                  if (newItems.length > 0) {
                    setMedications((prev) => [...prev, ...newItems].sort());
                  }
                  handleInputChange('topMedications', value);
                }}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Common Ailments Treated"
                placeholder="Select ailments"
                data={ailments.map((ailment) => ({
                  value: ailment,
                  label: ailment,
                }))}
                searchable
                withAsterisk
                mb="md"
                value={formData.commonAilments}
                onChange={(value) => {
                  // Handle new items
                  const newItems = value.filter(
                    (item) => !ailments.includes(item)
                  );
                  if (newItems.length > 0) {
                    setAilments((prev) => [...prev, ...newItems].sort());
                  }
                  handleInputChange('commonAilments', value);
                }}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Adverse Drug Reactions"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.adverseDrugReactions}
                onChange={(value) =>
                  handleInputChange('adverseDrugReactions', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                label="Adverse Reaction Details"
                placeholder="Provide details of any adverse reactions"
                mb="md"
                value={formData.adverseReactionDetails}
                onChange={(e) =>
                  handleInputChange('adverseReactionDetails', e.target.value)
                }
              />
            </Grid.Col>
          </Grid>

          <Divider
            my="md"
            label="Public Health Activities"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Referrals Made"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.referralsMade}
                onChange={(value) => handleInputChange('referralsMade', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Immunizations Given"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.immunizationsGiven}
                onChange={(value) =>
                  handleInputChange('immunizationsGiven', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Health Education Sessions"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.healthEducationSessions}
                onChange={(value) =>
                  handleInputChange('healthEducationSessions', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="BP Checks"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.bpChecks}
                onChange={(value) => handleInputChange('bpChecks', value)}
              />
            </Grid.Col>
          </Grid>

          <Divider my="md" label="Supply Chain Issues" labelPosition="center" />

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Expired Drugs Identified"
                mb="md"
                checked={formData.expiredDrugs}
                onChange={(e) =>
                  handleInputChange('expiredDrugs', e.currentTarget.checked)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Stockouts Experienced"
                mb="md"
                checked={formData.stockouts}
                onChange={(e) =>
                  handleInputChange('stockouts', e.currentTarget.checked)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Supply Delays"
                mb="md"
                checked={formData.supplyDelays}
                onChange={(e) =>
                  handleInputChange('supplyDelays', e.currentTarget.checked)
                }
              />
            </Grid.Col>
          </Grid>

          {/* Service Delivery Data */}
          <Divider
            my="md"
            label="Service Delivery Data"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Prescriptions Filled"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.prescriptionsFilled}
                onChange={(value) =>
                  handleInputChange('prescriptionsFilled', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="OTC Consultations"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.otcConsultations}
                onChange={(value) =>
                  handleInputChange('otcConsultations', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Medication Therapy Management Interventions"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.mtmInterventions}
                onChange={(value) =>
                  handleInputChange('mtmInterventions', value)
                }
              />
            </Grid.Col>
          </Grid>

          {/* Economic Contribution */}
          <Divider
            my="md"
            label="Economic Contribution"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Monthly Revenue (₦)"
                placeholder="Enter amount"
                min={0}
                mb="md"
                value={formData.monthlyRevenue}
                onChange={(value) => handleInputChange('monthlyRevenue', value)}
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Taxes Paid (₦)"
                placeholder="Enter amount"
                min={0}
                mb="md"
                value={formData.taxesPaid}
                onChange={(value) => handleInputChange('taxesPaid', value)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Staff - Pharmacists"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.staffPharmacists}
                onChange={(value) =>
                  handleInputChange('staffPharmacists', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Staff - Technicians"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.staffTechnicians}
                onChange={(value) =>
                  handleInputChange('staffTechnicians', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Staff - Others"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.staffOthers}
                onChange={(value) => handleInputChange('staffOthers', value)}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 12 }}>
              <NumberInput
                label="Number of Local Suppliers/Vendors"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.localSuppliersCount}
                onChange={(value) =>
                  handleInputChange('localSuppliersCount', value)
                }
              />
            </Grid.Col>
          </Grid>

          {/* Challenges and Barriers */}
          <Divider
            my="md"
            label="Challenges and Barriers"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Regulatory Compliance Cost (₦)"
                placeholder="Enter amount"
                min={0}
                mb="md"
                value={formData.regulatoryComplianceCost}
                onChange={(value) =>
                  handleInputChange('regulatoryComplianceCost', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Fake/Substandard Drugs Encountered"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.fakeOrSubstandardDrugs}
                onChange={(value) =>
                  handleInputChange('fakeOrSubstandardDrugs', value)
                }
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Access to Subsidized Essential Medicines"
                mb="md"
                checked={formData.hasSubsidizedMedicines}
                onChange={(e) =>
                  handleInputChange(
                    'hasSubsidizedMedicines',
                    e.currentTarget.checked
                  )
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Health Insurance Inclusion Issues"
                mb="md"
                checked={formData.insuranceInclusionIssues}
                onChange={(e) =>
                  handleInputChange(
                    'insuranceInclusionIssues',
                    e.currentTarget.checked
                  )
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Rejected Insurance Claims"
                placeholder="Enter number"
                min={0}
                mb="md"
                value={formData.rejectedInsuranceClaims}
                onChange={(value) =>
                  handleInputChange('rejectedInsuranceClaims', value)
                }
              />
            </Grid.Col>
          </Grid>

          {/* Public Health Partnerships */}
          <Divider
            my="md"
            label="Public Health Partnerships"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={12}>
              <MultiSelect
                label="Public Health Partnerships"
                placeholder="Enter organizations you partner with"
                data={[
                  { value: 'Ministry of Health', label: 'Ministry of Health' },
                  { value: 'WHO', label: 'World Health Organization (WHO)' },
                  { value: 'UNICEF', label: 'UNICEF' },
                  { value: 'Local NGOs', label: 'Local NGOs' },
                  {
                    value: 'Community Health Centers',
                    label: 'Community Health Centers',
                  },
                ]}
                searchable
                mb="md"
                value={formData.publicHealthPartnerships}
                onChange={(value) => {
                  // Handle new items manually
                  handleInputChange('publicHealthPartnerships', value);
                }}
              />
            </Grid.Col>
          </Grid>

          {/* Technology and Digital Adoption */}
          <Divider
            my="md"
            label="Technology and Digital Adoption"
            labelPosition="center"
          />

          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Uses Electronic Record Systems"
                mb="md"
                checked={formData.usesElectronicRecords}
                onChange={(e) =>
                  handleInputChange(
                    'usesElectronicRecords',
                    e.currentTarget.checked
                  )
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Uses Mobile Health Services"
                mb="md"
                checked={formData.usesMobileHealth}
                onChange={(e) =>
                  handleInputChange('usesMobileHealth', e.currentTarget.checked)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Uses Inventory Management Software"
                mb="md"
                checked={formData.usesInventoryManagement}
                onChange={(e) =>
                  handleInputChange(
                    'usesInventoryManagement',
                    e.currentTarget.checked
                  )
                }
              />
            </Grid.Col>
          </Grid>

          {/* Community Feedback */}
          <Divider my="md" label="Community Feedback" labelPosition="center" />

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Patient Satisfaction Score (1-10)"
                placeholder="Enter score"
                min={1}
                max={10}
                mb="md"
                value={formData.patientSatisfactionScore}
                onChange={(value) =>
                  handleInputChange('patientSatisfactionScore', value)
                }
              />
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Time Saved Compared to Hospital Visit (minutes)"
                placeholder="Enter minutes"
                min={0}
                mb="md"
                value={formData.timeComparedToHospital}
                onChange={(value) =>
                  handleInputChange('timeComparedToHospital', value)
                }
              />
            </Grid.Col>
          </Grid>

          <Textarea
            label="Additional Notes"
            placeholder="Any other information you'd like to share"
            mb="xl"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />

          <Group justify="flex-end">
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button type="submit">Submit Report</Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
