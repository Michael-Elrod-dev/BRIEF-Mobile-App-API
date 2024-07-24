import 'package:flutter/material.dart';
import 'package:namer_app/homepage.dart';
import 'assignments.dart';
import 'videos.dart';

class CoursePage extends StatelessWidget {
  final String courseId;
  final String courseName;

  CoursePage({
    required this.courseId,
    required this.courseName,
  });

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          leading: IconButton(
              icon: Icon(Icons.arrow_back),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => HomePage()),
                );
              }),
          bottom: TabBar(
            indicatorColor: Theme.of(context).colorScheme.onSecondary,
            labelColor: Theme.of(context).colorScheme.onSecondary,
            unselectedLabelColor: Theme.of(context).colorScheme.secondary,
            tabs: [
              Tab(text: 'Course'),
              Tab(text: 'Videos'),
            ],
          ),
          title: Text(courseName,
              style: TextStyle(
                color: Theme.of(context).colorScheme.onSecondary,
              )),
        ),
        body: TabBarView(
          children: [
            Assignments(
              courseId: courseId,
              courseName: courseName,
            ),
            YouTubeScreen(
              courseName: courseName,
            ),
          ],
        ),
      ),
    );
  }
}
