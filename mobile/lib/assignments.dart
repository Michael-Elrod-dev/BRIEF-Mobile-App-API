import 'package:flutter/material.dart';
import 'assignments_holder.dart';
import 'use_api.dart';
import 'data.dart';
import 'package:gap/gap.dart';

class Assignments extends StatefulWidget {
  final String courseId;
  final String courseName;

  Assignments({
    required this.courseId,
    required this.courseName,
  });

  @override
  _AssignmentsState createState() => _AssignmentsState();
}

class _AssignmentsState extends State<Assignments> {
  late Future<List<Assignment>> _assignmentsFuture;

  @override
  void initState() {
    super.initState();
    _assignmentsFuture = ApiService().getAllCourseAssignments(widget.courseId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: FutureBuilder<List<Assignment>>(
        future: _assignmentsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasError) {
              return Center(child: Text('Error: ${snapshot.error}'));
            }
            return buildAssignmentsList(snapshot.data!);
          } else {
            return Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }

  Widget buildAssignmentsList(List<Assignment> assignments) {
    List<Widget> assignmentWidgets = [];
    for (int i = 0; i < assignments.length; i++) {
      assignmentWidgets.add(buildAssignmentItem(i + 1, assignments[i]));
      if (i < assignments.length - 1) {
        assignmentWidgets.add(Gap(100));
      }
    }

    return SingleChildScrollView(
      child: Column(
        children: assignmentWidgets,
      ),
    );
  }

  Widget buildAssignmentItem(int index, Assignment assignment) {
    Widget imageWidget1 = Image.asset('lib/assets/images/bulbycomputer.png',
        width: 100.0, height: 90.0);
    Widget imageWidget2 = Image.asset('lib/assets/images/BulbyWattsoncheer.png',
        width: 100.0, height: 90.0);
    Widget imageWidget3 = Image.asset('lib/assets/images/BulbyWattsoncheer.png',
        width: 110.0, height: 100.0);

    // Determine the position of the button and image based on index
    bool isButtonOnLeft = index % 3 == 1;
    bool isButtonInCenter = index % 3 == 2;
    bool isButtonOnRight = index % 3 == 0;

    MainAxisAlignment rowAlignment = MainAxisAlignment.center;
    if (isButtonOnLeft) {
      rowAlignment = MainAxisAlignment.start;
    } else if (isButtonOnRight) {
      rowAlignment = MainAxisAlignment.end;
    }

    List<Widget> rowChildren = [];
    if (isButtonOnRight) {
      rowChildren.add(imageWidget1);
      rowChildren.add(SizedBox(width: 90)); // Padding between image and button
    }

    rowChildren.add(Container(
      padding: EdgeInsets.only(
        left: isButtonOnLeft ? 90.0 : 0.0,
        right: isButtonOnRight ? 90.0 : 0.0,
      ),
      child: ElevatedButton(
        style: ElevatedButton.styleFrom(
          shape: CircleBorder(),
          fixedSize: Size(90, 90),
        ),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => AssignmentHolder(assignment: assignment),
            ),
          );
        },
        child: Icon(Icons.star,
            size: 50, color: Theme.of(context).colorScheme.secondary),
      ),
    ));

    if (isButtonOnLeft) {
      rowChildren.add(SizedBox(width: 90)); // Padding between button and image
      rowChildren.add(imageWidget3);
    }

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 20),
      child: Row(
        mainAxisAlignment: rowAlignment,
        children: rowChildren,
      ),
    );
  }
}
