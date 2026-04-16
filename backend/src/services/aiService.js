import axios from 'axios';

class AIService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
    this.openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Analyze symptoms using AI
   * @param {Array} symptoms - List of symptoms
   * @param {Object} userInfo - User age, gender, medical history
   * @returns {Object} Analysis result with diseases and recommendations
   */
  async analyzeSymptoms(symptoms, userInfo = {}) {
    try {
      const prompt = this.buildSymptomPrompt(symptoms, userInfo);

      const response = await axios.post(
        this.openaiEndpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a medical assistant AI. Analyze symptoms and provide possible diseases with confidence scores and severity levels. Always remind that your analysis is for informational purposes only and not a medical diagnosis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const analysis = this.parseSymptomAnalysis(aiResponse);

      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      console.error('AI symptom analysis error:', error);
      return {
        success: false,
        error: error.message,
        // Fallback logic - return basic analysis
        data: this.getFallbackSymptomAnalysis(symptoms)
      };
    }
  }

  /**
   * Analyze medical report text
   * @param {String} reportText - Extracted text from report
   * @returns {Object} Analysis with abnormal values and advice
   */
  async analyzeReport(reportText) {
    try {
      const prompt = `
        Analyze this medical report and provide:
        1. Summary of findings
        2. List abnormal values with parameters and normal ranges
        3. Health advice and recommendations
        
        Report: ${reportText}
        
        Respond in JSON format with keys: summary, abnormalValues (array of {parameter, value, normalRange, status}), advice
      `;

      const response = await axios.post(
        this.openaiEndpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a medical report analyzer. Extract and explain medical findings in simple terms.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 1500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      const analysis = this.parseReportAnalysis(aiResponse);

      return {
        success: true,
        data: analysis
      };
    } catch (error) {
      console.error('AI report analysis error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check for emergency symptoms
   * @param {Array} symptoms - List of symptoms
   * @returns {Boolean} Is emergency
   */
  isEmergency(symptoms) {
    const emergencySymptoms = [
      'chest pain', 'severe chest pain', 'difficulty breathing',
      'severe shortness of breath', 'loss of consciousness',
      'severe bleeding', 'choking', 'poisoning',
      'severe allergic reaction', 'stroke signs'
    ];

    return symptoms.some(symptom => 
      emergencySymptoms.some(emergency => 
        symptom.toLowerCase().includes(emergency)
      )
    );
  }

  // Helper methods
  buildSymptomPrompt(symptoms, userInfo) {
    return `
      Patient symptoms: ${symptoms.join(', ')}
      Age: ${userInfo.age || 'Unknown'}
      Gender: ${userInfo.gender || 'Unknown'}
      Medical History: ${(userInfo.medicalHistory || []).join(', ') || 'None'}
      
      Please analyze these symptoms and provide:
      1. Top 3-5 possible diseases
      2. Confidence score (0-100) for each
      3. Severity level (low, medium, high)
      4. General advice
      
      Respond in JSON format with keys: diseases (array), recommendation, isEmergency
    `;
  }

  parseSymptomAnalysis(response) {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Parse error:', error);
    }

    return this.getFallbackSymptomAnalysis([]);
  }

  parseReportAnalysis(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Parse error:', error);
    }

    return {
      summary: response,
      abnormalValues: [],
      advice: 'Please consult with a healthcare professional for detailed interpretation.'
    };
  }

  getFallbackSymptomAnalysis(symptoms) {
    return {
      diseases: [
        {
          name: 'Common Cold',
          confidence: 45,
          severity: 'low',
          advice: 'Rest and stay hydrated'
        },
        {
          name: 'Flu',
          confidence: 35,
          severity: 'medium',
          advice: 'Consult a doctor if symptoms persist'
        }
      ],
      recommendation: 'Please provide more details for a better analysis',
      isEmergency: false
    };
  }
}

export default new AIService();
