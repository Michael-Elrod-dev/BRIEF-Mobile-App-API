import 'package:flutter/material.dart';

class User {
  final String suiteEmail;
  final String firstName;
  final String lastName;
  final String role;
  final List<String> courseIDs;
  final List<String> assignmentIDs;
  final int mastery;
  final int streak;
  final int totalStreak;
  final int coursesComplete;
  final int rewardsComplete;
  final String dateJoined;
  final String imageUrl;

  User({
    required this.suiteEmail,
    required this.firstName,
    required this.lastName,
    required this.role,
    required this.courseIDs,
    required this.assignmentIDs,
    required this.mastery,
    required this.streak,
    required this.totalStreak,
    required this.coursesComplete,
    required this.rewardsComplete,
    required this.dateJoined,
    required this.imageUrl,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      suiteEmail: json['suiteEmail'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      role: json['role'] as String,
      courseIDs: List<String>.from(json['courseIDs'] ?? []),
      assignmentIDs: List<String>.from(json['assignmentIDs'] ?? []),
      mastery: json['mastery'] ?? 0,
      streak: json['streak'] ?? 0,
      totalStreak: json['totalStreak'] ?? 0,
      coursesComplete: json['coursesComplete'] ?? 0,
      rewardsComplete: json['rewardsComplete'] ?? 0,
      dateJoined: json['dateJoined'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
    );
  }
  Map<String, dynamic> toJson() {
    return {
      'suiteEmail': suiteEmail,
      'firstName': firstName,
      'lastName': lastName,
      'role': role,
      'courseIDs': courseIDs,
      'assignmentIDs': assignmentIDs,
      'mastery': mastery,
      'streak': streak,
      'totalStreak': totalStreak,
      'coursesComplete': coursesComplete,
      'rewardsComplete': rewardsComplete,
      'dateJoined': dateJoined,
      'imageUrl': imageUrl,
    };
  }
}

class Course {
  final String id;
  final String courseNumber;
  final String courseName;
  final List<String>? instructors; // Optional
  final List<String>? students; // Optional
  final String type;

  Course({
    required this.id,
    required this.courseNumber,
    required this.courseName,
    this.instructors,
    this.students,
    required this.type,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'] as String,
      courseNumber: json['courseNumber'],
      courseName: json['courseName'] as String,
      instructors: json['instructors'] != null
          ? List<String>.from(json['instructors'])
          : null,
      students:
          json['students'] != null ? List<String>.from(json['students']) : null,
      type: json['type'] as String,
    );
  }
}

class Assignment {
  final String name;
  final String courseId;
  final String id;
  final List<String> description;
  final String assets;
  final List<String> attempts;
  final int minimumScore;
  final List<Question> questions;

  Assignment({
    required this.name,
    required this.courseId,
    required this.id,
    required this.description,
    required this.assets,
    required this.attempts,
    required this.minimumScore,
    required this.questions,
  });

  factory Assignment.fromJson(Map<String, dynamic> json) {
    return Assignment(
      name: json['name'] as String,
      courseId: json['courseID'] as String,
      id: json['id'] as String,
      description: _flattenDescription(json['description']),
      assets: json['assets'] as String,
      attempts: List<String>.from(json['attempts'] ?? []),
      minimumScore: json['minimumScore'] is String
          ? int.parse(json['minimumScore'])
          : json['minimumScore'],
      questions: json['questions'] != null
          ? List<Question>.from(
              json['questions'].map((x) => Question.fromJson(x)))
          : [],
    );
  }

  static List<String> _flattenDescription(dynamic description,
      {List<String> flattened = const []}) {
    if (description == null) {
      return flattened;
    } else if (description is List) {
      return description.expand((item) => _flattenDescription(item)).toList();
    } else {
      return [description.toString()];
    }
  }
}

class Question {
  final String correct;
  final List<String> choices;
  final String prompt;

  Question({
    required this.correct,
    required this.choices,
    required this.prompt,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      correct: json['correct'] as String,
      choices: List<String>.from(json['choices']),
      prompt: json['prompt'] as String,
    );
  }
}

class Attempt {
  final String id;
  final String suiteEmail;
  final String assignmentID;
  final int score;
  final String completed;

  Attempt({
    required this.id,
    required this.suiteEmail,
    required this.assignmentID,
    required this.score,
    required this.completed,
  });

  factory Attempt.fromJson(Map<String, dynamic> json) {
    return Attempt(
      id: json['id'] as String,
      suiteEmail: json['suiteEmail'] as String,
      assignmentID: json['assignmentID'] as String,
      score: json['score'] as int,
      completed: json['completed'] as String,
    );
  }
}

class Reward {
  final String title;
  final IconData icon;
  final double progress;
  final int total;

  Reward({
    required this.title,
    required this.icon,
    required this.progress,
    required this.total,
  });
}
