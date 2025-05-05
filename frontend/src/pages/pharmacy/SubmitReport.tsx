import { useState } from 'react';
import { 
  Title, 
  Paper, 
  TextInput, 
  NumberInput, 
  Button, 
  Group, 
  Divider, 
  Textarea, 
  Switch, 
  MultiSelect,
  Select,
  Grid,
  Alert
} from '@mantine/core';
import { DateInput } from '@mantine/dates';

export function SubmitReport() {
  const [submitted, setSubmitted] = useState(false);
  
  // Mock data for dropdowns
  const commonMedications = [
    'Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Metformin', 
    'Lisinopril', 'Omeprazole', 'Atorvastatin', 'Salbutamol',
    'Hydrochlorothiazide', 'Metronidazole', 'Ciprofloxacin'
  ];
  
  const commonAilments = [
    'Malaria', 'Upper Respiratory Infection', 'Hypertension', 
    'Diabetes', 'Gastritis', 'Urinary Tract Infection', 
    'Pneumonia', 'Arthritis', 'Asthma', 'Skin Infection'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call the API
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };
  
  if (submitted) {
    return (
      <div>
        <Title order={2} mb="lg">Submit Monthly Report</Title>
        <Alert color="green" title="Success!" mb="xl">
          Your monthly report has been submitted successfully.
        </Alert>
        <Button onClick={() => setSubmitted(false)}>Submit Another Report</Button>
      </div>
    );
  }
  
  return (
    <div>
      <Title order={2} mb="lg">Submit Monthly Report</Title>
      
      <Paper withBorder p="md">
        <form onSubmit={handleSubmit}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <DateInput
                label="Report Date"
                placeholder="Select date"
                required
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Total Patients Served"
                placeholder="Enter number"
                required
                min={0}
                mb="md"
              />
            </Grid.Col>
          </Grid>
          
          <Divider my="md" label="Patient Demographics" labelPosition="center" />
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Male Patients"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NumberInput
                label="Female Patients"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Children (0-12 years)"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Adults (13-59 years)"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Elderly (60+ years)"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
          </Grid>
          
          <Divider my="md" label="Medications & Ailments" labelPosition="center" />
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Top Medications Dispensed"
                placeholder="Select medications"
                data={commonMedications}
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <MultiSelect
                label="Common Ailments Treated"
                placeholder="Select ailments"
                data={commonAilments}
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                mb="md"
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
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Textarea
                label="Adverse Reaction Details"
                placeholder="Provide details of any adverse reactions"
                mb="md"
              />
            </Grid.Col>
          </Grid>
          
          <Divider my="md" label="Public Health Activities" labelPosition="center" />
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Referrals Made"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Immunizations Given"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="Health Education Sessions"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 3 }}>
              <NumberInput
                label="BP Checks"
                placeholder="Enter number"
                min={0}
                mb="md"
              />
            </Grid.Col>
          </Grid>
          
          <Divider my="md" label="Supply Chain Issues" labelPosition="center" />
          
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Expired Drugs Identified"
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Stockouts Experienced"
                mb="md"
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Switch
                label="Supply Delays"
                mb="md"
              />
            </Grid.Col>
          </Grid>
          
          <Textarea
            label="Additional Notes"
            placeholder="Any other information you'd like to share"
            mb="xl"
          />
          
          <Group justify="flex-end">
            <Button type="reset" variant="outline">Reset</Button>
            <Button type="submit">Submit Report</Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
