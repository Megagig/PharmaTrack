import api from './api';

// Default medications list (comprehensive)
const DEFAULT_MEDICATIONS = [
  'Paracetamol',
  'Amoxicillin',
  'Ibuprofen',
  'Artemether/Lumefantrine',
  'Metformin',
  'Amlodipine',
  'Lisinopril',
  'Omeprazole',
  'Ciprofloxacin',
  'Metronidazole',
  'Atorvastatin',
  'Losartan',
  'Hydrochlorothiazide',
  'Aspirin',
  'Diazepam',
  'Fluoxetine',
  'Insulin',
  'Salbutamol',
  'Prednisolone',
  'Azithromycin',
  'Ceftriaxone',
  'Diclofenac',
  'Ranitidine',
  'Simvastatin',
  'Tramadol',
  'Warfarin',
  'Levothyroxine',
  'Furosemide',
  'Morphine',
  'Doxycycline',
];

// Default ailments list (comprehensive)
const DEFAULT_AILMENTS = [
  'Malaria',
  'Typhoid',
  'Common Cold',
  'Hypertension',
  'Diabetes',
  'Peptic Ulcer',
  'Urinary Tract Infection',
  'Respiratory Infection',
  'Diarrhea',
  'Skin Infection',
  'Asthma',
  'Arthritis',
  'Pneumonia',
  'Tuberculosis',
  'HIV/AIDS',
  'Hepatitis',
  'Anemia',
  'Depression',
  'Anxiety',
  'Insomnia',
  'Migraine',
  'Allergies',
  'Gastritis',
  'Osteoporosis',
  'Eczema',
  'Conjunctivitis',
  'Sinusitis',
  'Bronchitis',
  'Otitis Media',
  'Gastroenteritis',
];

/**
 * Service for fetching medications and ailments data from the FDA API
 * with robust fallback mechanisms
 */
export const fdaService = {
  /**
   * Get medications from the FDA API
   * @param limit Number of medications to fetch (default: 100)
   * @returns Array of medication names
   */
  getMedications: async (limit: number = 100): Promise<string[]> => {
    try {
      // Set a timeout for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await api.get<string[]>(
        `/fda/medications?limit=${limit}`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      // If we got data, return it
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        console.log(
          `Successfully fetched ${response.data.length} medications from API`
        );
        return response.data;
      }

      // If we got an empty array, use defaults
      console.warn('API returned empty medications array, using defaults');
      return DEFAULT_MEDICATIONS;
    } catch (error) {
      console.error('Error fetching medications:', error);
      // Return default medications if API call fails
      return DEFAULT_MEDICATIONS;
    }
  },

  /**
   * Get common ailments
   * @returns Array of ailment names
   */
  getAilments: async (): Promise<string[]> => {
    try {
      // Set a timeout for the API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await api.get<string[]>('/fda/ailments', {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If we got data, return it
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        console.log(
          `Successfully fetched ${response.data.length} ailments from API`
        );
        return response.data;
      }

      // If we got an empty array, use defaults
      console.warn('API returned empty ailments array, using defaults');
      return DEFAULT_AILMENTS;
    } catch (error) {
      console.error('Error fetching ailments:', error);
      // Return default ailments if API call fails
      return DEFAULT_AILMENTS;
    }
  },
};
