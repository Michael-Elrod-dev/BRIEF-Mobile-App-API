import 'dart:convert';
import 'data.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  final String apiUrl = 'https://api.brief.stemrocks.net';
  final String suiteApiUrl = 'https://api.suite.stemrocks.net';
  final String adminApiUrl = 'https://api.brief.stemrocks.net/admin';

  Future<String> getBearerString() async {
    final prefs = await SharedPreferences.getInstance();
    final accessToken = prefs.getString('ACCESS_TOKEN') ?? '';
    final refreshToken = prefs.getString('REFRESH_TOKEN') ?? '';
    return 'Bearer $accessToken;$refreshToken';
  }

  Future<dynamic> sendRequest(http.Client client, Uri url,
      {String method = 'GET', dynamic data}) async {
    var headers = <String, String>{
      'Content-Type': 'application/json',
      'Authorization': await getBearerString(),
    };

    // Default response
    http.Response response = http.Response('{"status":"no request sent"}', 500);

    try {
      switch (method) {
        case 'GET':
          response = await client.get(url, headers: headers);
          break;
        case 'POST':
          response =
              await client.post(url, headers: headers, body: json.encode(data));
          break;
        case 'PUT':
          response =
              await client.put(url, headers: headers, body: json.encode(data));
          break;
        // Add other HTTP methods as needed.
        default:
          // Optionally handle other methods or throw an exception
          break;
      }

      final responseData = json.decode(response.body);

      // Handle access and refresh tokens in the response
      if (responseData.containsKey('accessToken')) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('ACCESS_TOKEN', responseData['accessToken']);
      }
      if (responseData.containsKey('refreshToken')) {
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('REFRESH_TOKEN', responseData['refreshToken']);
      }
      if (response.statusCode < 400) {
        return responseData;
      } else {
        print('Request failed with status: ${response.statusCode}');
        print('Response body: ${response.body}');
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }

  Future<User?> getUser() async {
    final url = Uri.parse('$apiUrl/users');

    try {
      final response = await sendRequest(http.Client(), url, method: 'GET');

      if (response != null &&
          response.containsKey('user') &&
          response.containsKey('student')) {
        // Cast both 'user' and 'student' to Map<String, dynamic> and handle potential nulls.
        final combinedUserData = {
          ...(response['user'] as Map<String, dynamic>? ?? {}),
          ...(response['student'] as Map<String, dynamic>? ?? {}),
        };

        return User.fromJson(combinedUserData);
      }
      return null;
    } catch (e) {
      print('Error fetching user data: $e');
      return null;
    }
  }

  Future<User?> editStudentProfile(
      String suiteEmail, Map<String, dynamic> updates) async {
    final url = Uri.parse('$apiUrl/users/$suiteEmail');

    try {
      final response = await sendRequest(
        http.Client(),
        url,
        method: 'PUT',
        data: updates,
      );

      if (response != null && response['user'] != null) {
        return User.fromJson(response['user']);
      }
      return null;
    } catch (e) {
      print('Error updating student profile: $e');
      return null;
    }
  }

  Future<dynamic> signInStepOne(Map<String, dynamic> payload) async {
    var url = Uri.parse('$apiUrl/auth');
    return sendRequest(http.Client(), url, method: 'POST', data: payload);
  }

  Future<dynamic> signInStepTwo(Map<String, dynamic> payload) async {
    var url = Uri.parse('$apiUrl/2fa');
    return sendRequest(http.Client(), url, method: 'POST', data: payload);
  }

  Future<List<Assignment>> getAllCourseAssignments(String courseId) async {
    var url = Uri.parse('$apiUrl/assignment?course_id=$courseId');
    try {
      final response = await sendRequest(http.Client(), url, method: "GET");
      if (response['assignments'] != null) {
        return List<Assignment>.from(
            response['assignments'].map((x) => Assignment.fromJson(x)));
      } else {
        print('No assignments found for the course');
        return [];
      }
    } catch (e) {
      print('Error fetching assignment data: $e');
      return [];
    }
  }

  Future<List<Course>?> getCourses() async {
    var url = Uri.parse('$apiUrl/course');
    try {
      final response = await sendRequest(http.Client(), url, method: "GET");
      List<Course> courses = [];
      for (final c in response['courses']) {
        courses.add(Course.fromJson(c));
      }
      return courses;
    } catch (e) {
      print('Error fetching course data: $e');
      return null;
    }
  }

  Future<dynamic> createAssignmentAttempt(
      String assignmentId, List<String> answers) async {
    var url =
        Uri.parse('$apiUrl/assignment/attempt?assignmentID=$assignmentId');

    http.Client client = http.Client();
    try {
      var response = await sendRequest(
        http.Client(),
        url,
        method: 'POST',
        data: {'answers': answers},
      );
      return response;
    } finally {
      client.close();
    }
  }
}
