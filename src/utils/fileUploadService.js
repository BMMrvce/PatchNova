import { supabase } from './supabase';

class FileUploadService {
  // Log file upload activity
  async logFileUpload(userId, fileData) {
    try {
      const { data, error } = await supabase
        .from('file_upload_logs')
        .insert({
          user_id: userId,
          file_name: fileData.name,
          file_size: fileData.size,
          file_type: fileData.type,
          upload_status: 'uploading',
          file_path: fileData.path || null,
          scan_id: fileData.scanId || null
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to log file upload' };
    }
  }

  // Update file upload status
  async updateFileUploadStatus(uploadId, status, details = {}) {
    try {
      const updateData = {
        upload_status: status,
        updated_at: new Date().toISOString()
      };

      if (details.errorMessage) {
        updateData.error_message = details.errorMessage;
      }

      if (details.processingTime) {
        updateData.processing_time_ms = details.processingTime;
      }

      if (details.filePath) {
        updateData.file_path = details.filePath;
      }

      const { data, error } = await supabase
        .from('file_upload_logs')
        .update(updateData)
        .eq('id', uploadId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update file upload status' };
    }
  }

  // Get file upload logs for a user
  async getFileUploadLogs(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('file_upload_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch file upload logs' };
    }
  }

  // Get all file upload logs (admin only)
  async getAllFileUploadLogs(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('file_upload_logs')
        .select(`
          *,
          user_profiles!inner(
            full_name,
            email,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch all file upload logs' };
    }
  }

  // Log scan results
  async logScanResult(fileUploadId, userId, scanData) {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .insert({
          file_upload_id: fileUploadId,
          user_id: userId,
          scan_status: 'pending',
          vulnerabilities_found: scanData.totalVulnerabilities || 0,
          high_risk_count: scanData.highRisk || 0,
          medium_risk_count: scanData.mediumRisk || 0,
          low_risk_count: scanData.lowRisk || 0,
          scan_data: scanData
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to log scan result' };
    }
  }

  // Update scan status
  async updateScanStatus(scanId, status, completedAt = null) {
    try {
      const updateData = {
        scan_status: status
      };

      if (completedAt) {
        updateData.completed_at = completedAt;
      }

      const { data, error } = await supabase
        .from('scan_results')
        .update(updateData)
        .eq('id', scanId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to update scan status' };
    }
  }

  // Get scan results for a user
  async getScanResults(userId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select(`
          *,
          file_upload_logs!inner(
            file_name,
            file_size,
            file_type,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch scan results' };
    }
  }

  // Get all scan results (admin only)
  async getAllScanResults(limit = 100) {
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select(`
          *,
          user_profiles!inner(
            full_name,
            email,
            role
          ),
          file_upload_logs!inner(
            file_name,
            file_size,
            file_type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: 'Failed to fetch all scan results' };
    }
  }

  // Get dashboard statistics
  async getDashboardStats(userId) {
    try {
      const { data: fileStats, error: fileError } = await supabase
        .from('file_upload_logs')
        .select('upload_status')
        .eq('user_id', userId);

      const { data: scanStats, error: scanError } = await supabase
        .from('scan_results')
        .select('scan_status, vulnerabilities_found, high_risk_count, medium_risk_count, low_risk_count')
        .eq('user_id', userId);

      if (fileError || scanError) {
        return { success: false, error: 'Failed to fetch dashboard statistics' };
      }

      return { 
        success: true, 
        data: {
          fileStats: fileStats || [],
          scanStats: scanStats || []
        }
      };
    } catch (error) {
      return { success: false, error: 'Failed to fetch dashboard statistics' };
    }
  }
}

export default new FileUploadService();