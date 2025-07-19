// Browser Console Debug Script for PatchNova
// Copy and paste this into your browser console at https://patch-nova-plum.vercel.app

console.log('🔍 PatchNova API Debug Script');
console.log('==============================');

// Check if we're in the right environment
if (typeof import.meta !== 'undefined' && import.meta.env) {
  console.log('\n📝 Environment Variables:');
  console.log('OpenAI API Key:', import.meta.env.VITE_OPENAI_API_KEY ? '✅ Present' : '❌ Missing');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Present' : '❌ Missing');
  console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing');
  
  // Test OpenAI API
  window.testOpenAI = async function() {
    console.log('\n🤖 Testing OpenAI API...');
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 5
        })
      });
      
      if (response.ok) {
        console.log('✅ OpenAI API working');
        return true;
      } else {
        console.log('❌ OpenAI API error:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ OpenAI error:', error);
      return false;
    }
  };
  
  // Test Supabase
  window.testSupabase = async function() {
    console.log('\n📊 Testing Supabase...');
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });
      
      if (response.ok) {
        console.log('✅ Supabase API working');
        return true;
      } else {
        console.log('❌ Supabase API error:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Supabase error:', error);
      return false;
    }
  };
  
  // Test both APIs
  window.testAllAPIs = async function() {
    console.log('\n🧪 Testing all APIs...');
    const openaiResult = await testOpenAI();
    const supabaseResult = await testSupabase();
    
    if (openaiResult && supabaseResult) {
      console.log('\n🎉 All APIs are working!');
    } else {
      console.log('\n⚠️ Some APIs are not working. Check the errors above.');
    }
  };
  
  console.log('\n📋 Available Commands:');
  console.log('- testOpenAI() - Test OpenAI API');
  console.log('- testSupabase() - Test Supabase API');
  console.log('- testAllAPIs() - Test all APIs');
  
} else {
  console.log('❌ Not in Vite environment. Make sure you\'re on the deployed site.');
}