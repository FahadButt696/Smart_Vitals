import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/symptom-check';

const testCases = [
  { 
    name: "Headache with nausea", 
    text: "I have been experiencing severe headaches for the past 3 days, along with nausea and sensitivity to light. I also feel dizzy when I stand up quickly.", 
    age: 30, 
    sex: "female" 
  },
  { 
    name: "Chest pain symptoms", 
    text: "Experiencing chest pain, shortness of breath, and left arm numbness since this morning. The pain is sharp and radiates to my jaw.", 
    age: 45, 
    sex: "male" 
  },
  { 
    name: "Stomach issues", 
    text: "I've had stomach pain, bloating, and loss of appetite for the past week. Sometimes I feel nauseous after eating.", 
    age: 28, 
    sex: "female" 
  }
];

async function testTextParsing() {
  console.log('🧪 Testing Text-Based Symptom Parsing API\n');
  
  for (const testCase of testCases) {
    console.log(`📝 Test: ${testCase.name}`);
    console.log(`Text: "${testCase.text}"`);
    console.log(`Age: ${testCase.age}, Sex: ${testCase.sex}\n`);
    
    try {
      const response = await axios.post(`${API_BASE}/parse-text`, {
        text: testCase.text, 
        age: testCase.age, 
        sex: testCase.sex
      });
      
      if (response.data.success) {
        console.log('✅ Success!');
        console.log(`Found ${response.data.data.parsedSymptoms.length} symptoms:`);
        response.data.data.parsedSymptoms.forEach((symptom, index) => {
          console.log(`  ${index + 1}. ${symptom.name} (${symptom.type})`);
        });
        
        // Test the new workflow: send structured symptoms directly to diagnosis
        console.log('\n🔄 Testing direct diagnosis with parsed symptoms...');
        await testDirectDiagnosis(testCase, response.data.data.parsedSymptoms);
        
      } else {
        console.log('❌ Failed:', response.data.error);
      }
    } catch (error) {
      console.log('❌ Error:', error.response?.data?.error || error.message);
    }
    
    console.log('\n' + '─'.repeat(60) + '\n');
  }
}

async function testDirectDiagnosis(testCase, parsedSymptoms) {
  try {
    // Convert parsed symptoms to the format expected by the diagnosis endpoint
    const structuredSymptoms = parsedSymptoms.map(symptom => ({
      id: symptom.id,
      name: symptom.name,
      choice_id: "present"
    }));

    const response = await axios.post(`${API_BASE}/check`, {
      userId: 'test-user-123',
      age: testCase.age,
      sex: testCase.sex,
      symptomsEntered: testCase.text,
      structuredSymptoms: structuredSymptoms
    });

    if (response.data.success) {
      console.log('✅ Direct diagnosis successful!');
      console.log(`Triage Level: ${response.data.data.triage?.level || 'Unknown'}`);
      console.log(`Conditions found: ${response.data.data.conditions?.length || 0}`);
      if (response.data.data.conditions?.length > 0) {
        console.log('Top condition:', response.data.data.conditions[0].name, 
          `(${(response.data.data.conditions[0].probability * 100).toFixed(1)}%)`);
      }
    } else {
      console.log('❌ Direct diagnosis failed:', response.data.error);
    }
  } catch (error) {
    console.log('❌ Direct diagnosis error:', error.response?.data?.error || error.message);
  }
}

testTextParsing().catch(console.error);
