import { OpenAIService } from '../services/OpenAIService';
import { StorageService } from '../services/StorageService';
import { CitizenGenerator } from '../services/CitizenGenerator';
import { PopulationGenerator } from './generateCitizens';
import { RelationshipManager } from '../services/RelationshipManager';
import { Citizen } from '../models/Citizen';

async function addCitizens() {
  const args = process.argv.slice(2);
  const openAIService = new OpenAIService();
  const storageService = new StorageService();
  await storageService.load();
  const citizenGenerator = new CitizenGenerator(openAIService, storageService);
  
  let newCitizens: Citizen[] = [];
  const count = parseInt(args[0]) || 5;

  // Check if custom citizen data is provided (count, name, age, occupation)
  if (args.length >= 4) {
    const name = args[1]; // Now expecting the full name in one argument
    const age = parseInt(args[2]);
    const occupation = args.slice(3).join(' ');
    
    console.log(`\nCreating custom citizen: ${name}, ${age}, ${occupation}\n`);
    
    try {
      const citizen = await citizenGenerator.createCustomCitizen(name, age, occupation);
      await storageService.addCitizen(citizen);
      newCitizens = [citizen];
      console.log(`Generated custom citizen: ${citizen.name}`);
    } catch (error) {
      console.error('Error creating custom citizen:', error);
      return;
    }
  } else {
    // Generate random citizens if no custom data
    console.log(`\nAdding ${count} new random citizens to the city...\n`);
    try {
      const theme = storageService.getCityTheme() || "A diverse modern city";
      const populationGenerator = new PopulationGenerator(
        openAIService,
        storageService,
        citizenGenerator
      );
      newCitizens = await populationGenerator.generateThematicPopulation(count, theme);
    } catch (error) {
      console.error('Error generating random citizens:', error);
      if (error instanceof SyntaxError) {
        console.error('Failed to parse AI response. Retrying with default theme...');
        const populationGenerator = new PopulationGenerator(
          openAIService,
          storageService,
          citizenGenerator
        );
        newCitizens = await populationGenerator.generateThematicPopulation(count, "A diverse modern city");
      } else {
        return;
      }
    }
  }

  if (newCitizens.length > 0) {
    // Generate relationships with existing population
    console.log("\nGenerating relationships with existing citizens...");
    const relationshipManager = new RelationshipManager(storageService, openAIService);
    const existingCitizens = (await storageService.getAllCitizens()).map(data => new Citizen(data));
    await relationshipManager.generateSocialRelationships([...existingCitizens, ...newCitizens]);

    console.log("\nNew citizens have been added successfully!");
  } else {
    console.error("\nNo citizens were generated. Please try again.");
  }
}

addCitizens().catch(console.error); 