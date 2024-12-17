import { OpenAIService } from '../services/OpenAIService';
import { StorageService } from '../services/StorageService';
import { CitizenGenerator } from '../services/CitizenGenerator';
import { InteractionGenerator } from '../services/InteractionGenerator';
import { PopulationGenerator } from './generateCitizens';
import { InteractionSimulator } from './generateInteractions';
import { RelationshipManager } from '../services/RelationshipManager';

async function initiateCity() {
  // Get all arguments after the script name and join them into a theme
  const args = process.argv.slice(2);
  const theme = args.length > 0 
    ? args.join(' ').replace(/[\[\]]/g, '') // Remove any brackets if present
    : "A diverse solarpunk city with a mix of cultures";

  const openAIService = new OpenAIService();
  const storageService = new StorageService();
  await storageService.load();

  console.log(`\nInitializing city with theme: "${theme}"\n`);

  // Initialize metadata first
  const metadata = {
    lastUpdate: new Date().toISOString(),
    version: '1.0',
    count: 0,
    theme: theme,
    createdAt: new Date().toISOString()
  };
  
  // Update metadata in storage service
  storageService.initializeWithMetadata(metadata);

  // Generate initial population
  const citizenGenerator = new CitizenGenerator(openAIService, storageService);
  const populationGenerator = new PopulationGenerator(
    openAIService,
    storageService,
    citizenGenerator
  );
  
  console.log("Generating initial population...");
  const citizens = await populationGenerator.generateThematicPopulation(10, theme);
  
  // Generate initial relationships
  const relationshipManager = new RelationshipManager(storageService, openAIService);
  
  // Create families (groups of 3-5 people)
  const unassignedCitizens = [...citizens];
  while (unassignedCitizens.length >= 3) {
    const familySize = Math.floor(Math.random() * 3) + 3;
    const familyMembers = unassignedCitizens.splice(0, familySize);
    await relationshipManager.generateFamilyUnit(familyMembers);
  }

  // Generate social relationships
  console.log("\nGenerating initial relationships...")
  await relationshipManager.generateSocialRelationships(citizens);

  // Generate initial interactions
  console.log("\nGenerating initial interactions...");
  const interactionGenerator = new InteractionGenerator(openAIService, storageService);
  const interactionSimulator = new InteractionSimulator(
    openAIService,
    storageService,
    interactionGenerator
  );
  
  console.log("Generating 5 interactions...");
  await interactionSimulator.generateRandomInteractions(5);
  
  console.log("\nCity initialization complete!");
}

initiateCity().catch(console.error); 