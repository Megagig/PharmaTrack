import axios from 'axios';
import { prisma } from '../server';

// Define types for FDA API responses
interface FDADrugResponse {
  meta: {
    disclaimer: string;
    terms: string;
    license: string;
    last_updated: string;
    results: {
      skip: number;
      limit: number;
      total: number;
    };
  };
  results: FDADrug[];
}

interface FDADrug {
  application_number: string;
  sponsor_name: string;
  products: {
    product_number: string;
    reference_drug: string;
    brand_name: string;
    active_ingredients: {
      name: string;
      strength: string;
    }[];
    reference_standard: string;
    dosage_form: string;
    route: string;
    marketing_status: string;
  }[];
  submissions?: any[];
}

// Cache for medications and ailments to avoid excessive API calls
let medicationsCache: string[] = [];
let ailmentsCache: string[] = [];
let lastMedicationsFetch: number = 0;
let lastAilmentsFetch: number = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export class FDAService {
  /**
   * Fetch medications from the FDA API
   * @param limit Number of medications to fetch
   * @returns Array of medication names
   */
  async getMedications(limit: number = 100): Promise<string[]> {
    try {
      // Check if cache is valid
      const currentTime = Date.now();
      if (
        medicationsCache.length > 0 &&
        currentTime - lastMedicationsFetch < CACHE_TTL
      ) {
        console.log('Using cached medications data');
        return medicationsCache;
      }

      console.log('Fetching medications from FDA API...');

      // Fetch from FDA API
      const response = await axios.get<FDADrugResponse>(
        `https://api.fda.gov/drug/drugsfda.json?limit=${limit}`
      );

      // Extract unique medication names from the response
      const medications = new Set<string>();

      response.data.results.forEach((drug) => {
        drug.products?.forEach((product) => {
          if (product.brand_name) {
            medications.add(product.brand_name);
          }

          product.active_ingredients?.forEach((ingredient) => {
            if (ingredient.name) {
              medications.add(ingredient.name);
            }
          });
        });
      });

      // Convert Set to Array and sort alphabetically
      medicationsCache = Array.from(medications).sort();
      lastMedicationsFetch = currentTime;

      console.log(
        `Fetched ${medicationsCache.length} medications from FDA API`
      );
      return medicationsCache;
    } catch (error) {
      console.error('Error fetching medications from FDA API:', error);

      // If API call fails, try to get medications from previous reports
      try {
        console.log('Attempting to get medications from previous reports...');
        const reports = await prisma.report.findMany({
          select: {
            topMedications: true,
          },
        });

        const medications = new Set<string>();
        reports.forEach((report) => {
          report.topMedications.forEach((med) => medications.add(med));
        });

        // If we have medications from reports, use those
        if (medications.size > 0) {
          medicationsCache = Array.from(medications).sort();
          lastMedicationsFetch = Date.now();
          console.log(
            `Using ${medicationsCache.length} medications from previous reports`
          );
          return medicationsCache;
        }
      } catch (dbError) {
        console.error('Error fetching medications from database:', dbError);
      }

      // If all else fails, return default medications
      return [
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
      ];
    }
  }

  /**
   * Fetch common ailments
   * Since FDA API doesn't directly provide ailments, we'll use a combination of
   * approaches including fetching from previous reports and a predefined list
   * @returns Array of common ailment names
   */
  async getAilments(): Promise<string[]> {
    try {
      // Check if cache is valid
      const currentTime = Date.now();
      if (
        ailmentsCache.length > 0 &&
        currentTime - lastAilmentsFetch < CACHE_TTL
      ) {
        console.log('Using cached ailments data');
        return ailmentsCache;
      }

      // Try to get ailments from previous reports
      console.log('Attempting to get ailments from previous reports...');
      const reports = await prisma.report.findMany({
        select: {
          commonAilments: true,
        },
      });

      const ailments = new Set<string>();
      reports.forEach((report) => {
        report.commonAilments.forEach((ailment) => ailments.add(ailment));
      });

      // If we have ailments from reports, use those
      if (ailments.size > 0) {
        ailmentsCache = Array.from(ailments).sort();
        lastAilmentsFetch = currentTime;
        console.log(
          `Using ${ailmentsCache.length} ailments from previous reports`
        );
        return ailmentsCache;
      }

      // If no ailments found in reports, return default list
      ailmentsCache = [
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
      ];
      lastAilmentsFetch = currentTime;
      return ailmentsCache;
    } catch (error) {
      console.error('Error fetching ailments:', error);

      // Return default ailments if all else fails
      return [
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
      ];
    }
  }
}
