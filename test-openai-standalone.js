// Standalone OpenAI API Test
// Run this with: node test-openai-standalone.js

const OpenAI = require('openai');
require('dotenv').config();

async function testOpenAIAPI() {
  console.log('🔍 Testing OpenAI API Connection...\n');
  
  // Check if API key is present
  const apiKey = process.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ No API key found!');
    console.log('Make sure VITE_OPENAI_API_KEY is set in your .env file');
    return;
  }
  
  console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');
  
  const openai = new OpenAI({
    apiKey: apiKey,
  });
  
  try {
    // Test 1: Simple chat completion
    console.log('\n🧪 Test 1: Simple Chat Completion');
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello! Just testing the API connection. Please respond with 'API working'."
        }
      ],
      max_tokens: 100
    });
    
    console.log('✅ Chat completion successful!');
    console.log('Response:', response.choices[0].message.content);
    
    // Test 2: List available models
    console.log('\n🧪 Test 2: List Available Models');
    const modelsResponse = await openai.models.list();
    const availableModels = modelsResponse.data
      .filter(model => model.id.includes('gpt'))
      .map(model => model.id)
      .slice(0, 10); // Show first 10 GPT models
    
    console.log('✅ Available GPT models:', availableModels);
    
    // Test 3: Test vulnerability analysis with sample data
    console.log('\n🧪 Test 3: Vulnerability Analysis Test');
    const testXML = `<?xml version="1.0" encoding="UTF-8"?>
<nmaprun>
  <host>
    <address addr="192.168.1.100" addrtype="ipv4"/>
    <ports>
      <port protocol="tcp" portid="22">
        <state state="open" reason="syn-ack"/>
        <service name="ssh" product="OpenSSH" version="7.4"/>
      </port>
      <port protocol="tcp" portid="80">
        <state state="open" reason="syn-ack"/>
        <service name="http" product="Apache httpd" version="2.4.6"/>
      </port>
    </ports>
  </host>
</nmaprun>`;

    const analysisPrompt = `
      Analyze this simple Nmap XML data and provide a JSON response with vulnerabilities:
      
      ${testXML}
      
      Return only JSON format:
      {
        "totalVulnerabilities": 2,
        "highRisk": 0,
        "mediumRisk": 1,
        "lowRisk": 1,
        "summary": "Found outdated SSH and HTTP services"
      }
    `;

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert. Return only JSON format."
        },
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      max_tokens: 500
    });
    
    console.log('✅ Vulnerability analysis successful!');
    console.log('Analysis Response:', analysisResponse.choices[0].message.content);
    
    console.log('\n🎉 All tests passed! Your OpenAI API is working correctly.');
    
  } catch (error) {
    console.error('\n❌ OpenAI API Error:', error.message);
    
    if (error.status === 401) {
      console.log('💡 This looks like an authentication error. Check your API key.');
    } else if (error.status === 404) {
      console.log('💡 Model not found. Try using "gpt-3.5-turbo" instead of "gpt-4".');
    } else if (error.status === 429) {
      console.log('💡 Rate limit exceeded. Wait a moment and try again.');
    } else {
      console.log('💡 Error details:', error);
    }
  }
}

// Run the test
testOpenAIAPI();
