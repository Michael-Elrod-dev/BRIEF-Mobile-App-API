import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_tts/flutter_tts.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'rewards.dart';
import 'course.dart';
import 'settings.dart';
import 'profile.dart';
import 'use_api.dart';
import 'data.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  late List<Widget> _pages;
  List<Course> _courses = [];
  Widget? _lastSelectedCourse;
  Map<String, String> _courseNameToIdMap = {};
  User? _user;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchInitialData();
    _pages = [
      Container(), // Placeholder for Home content, will be set after build
      RewardsPage(),
      PlaceholderWidget(
          color: Colors.transparent), // Placeholder for course page
      ProfilePage(),
      SettingsPage(),
    ];
  }

  Future<void> _fetchInitialData() async {
    final ApiService apiService = ApiService();
    try {
      _user = await apiService.getUser();
      List<Course>? fetchedCourses = await apiService.getCourses();
      if (fetchedCourses != null) {
        _courses = fetchedCourses;
      } else {
        _courses = [];
      }
    } catch (e) {
      _courses = [];
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        backgroundColor: Theme.of(context).colorScheme.background,
        body: Center(child: CircularProgressIndicator()),
      );
    }
    // Dynamically set the home content page after the build context is available.
    if (_pages[0] is Container) {
      // Prevent setting it multiple times
      _pages[0] = FutureBuilder<List<Course>>(
        future: loadCourses(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            // While data is loading
            return buildHomeComponents();
          } else if (snapshot.hasError) {
            // If there's an error during data loading
            return Center(child: Text('Error loading data'));
          } else {
            _courses = snapshot.data!;
            return buildHomeComponents();
          }
        },
      );
    }

    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: _pages[_selectedIndex],
      bottomNavigationBar: buildBottomNavigationBar(),
    );
  }

  Future<List<Course>> loadCourses() async {
    final ApiService apiService = ApiService();
    List<Course> courses = [];
    final response = await apiService.getCourses();
    if (response != null) {
      courses = response;
      _buildCourseNameToIdMap(courses);
    }
    return courses;
  }

  void _buildCourseNameToIdMap(List<Course> courses) {
    _courseNameToIdMap = {
      for (var course in courses) course.courseName: course.id
    };
  }

  Widget buildBottomNavigationBar() {
    return Container(
      color: Colors.black,
      child: GNav(
        tabActiveBorder:
            Border.all(color: Theme.of(context).colorScheme.primary, width: 1),
        duration: Duration(milliseconds: 900),
        color: Colors.grey[600],
        activeColor: Theme.of(context).colorScheme.primary,
        iconSize: 24,
        tabBackgroundColor:
            Theme.of(context).colorScheme.primary.withOpacity(0.2),
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 3),
        tabs: [
          GButton(
            icon: Icons.home,
          ),
          GButton(
            icon: Icons.emoji_events,
          ),
          GButton(
            icon: Icons.book,
          ),
          GButton(
            icon: Icons.account_circle,
          ),
          GButton(
            icon: Icons.settings,
          ),
        ],
        selectedIndex: _selectedIndex,
        onTabChange: (index) {
          if (index == 2) {
            if (_lastSelectedCourse == null) {
              // Show popup if no course has been selected yet
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: Text("Notice"),
                    content: Text("No course has been selected yet"),
                    actions: [
                      TextButton(
                        child: Text("OK"),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  );
                },
              );
            } else {
              // Update the selected index to show the last selected course page
              setState(() {
                _selectedIndex = index;
                _pages[2] = _lastSelectedCourse!;
              });
            }
          } else {
            // Update the selected index for other tabs
            setState(() {
              _selectedIndex = index;
            });
          }
        },
      ),
    );
  }

  Widget buildHomeComponents() {
    List<Widget> courseButtons = generateCourseButtons();
    return Padding(
      padding: const EdgeInsets.all(0.0),
      child: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: 25),
            Image.asset('lib/assets/images/BulbyWattson.png',
                width: MediaQuery.of(context).size.width, height: 240),
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10.0),
              child: Text(
                'Hey, ${_user!.firstName} ${_user!.lastName}!',
                style: TextStyle(
                  fontSize: 30,
                  fontFamily: 'RobotoMono',
                  fontWeight: FontWeight.bold,
                  color:
                      Theme.of(context).colorScheme.background == Colors.white
                          ? Colors.black
                          : Theme.of(context).colorScheme.onSecondary,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            Text(
              "Choose a Course",
              style: TextStyle(
                fontSize: 30,
                fontFamily: 'RobotoMono',
                fontWeight: FontWeight.bold,
                color: Theme.of(context).colorScheme.background == Colors.white
                    ? Colors.black // Text color is black if background is white
                    : Theme.of(context).colorScheme.onSecondary,
              ),
            ),
            SizedBox(height: 20),
            Wrap(
              spacing: 16,
              runSpacing: 16,
              children: courseButtons,
            ),
          ],
        ),
      ),
    );
  }

  List<Widget> generateCourseButtons() {
    List<Widget> courseButtons = [];
    for (final c in _courses) {
      courseButtons.add(buildCourseButton(c.courseName));
    }
    return courseButtons;
  }

  void navigateToCoursePage(String courseName) {
    final courseId = _courseNameToIdMap[courseName];
    if (courseId == null) {
      // Error if course id is not found
      return;
    }

    setState(() {
      _lastSelectedCourse = CoursePage(
        courseId: courseId,
        courseName: courseName,
      );
      _selectedIndex = 2;
      _pages[2] = _lastSelectedCourse!;
    });
  }

  FlutterTts flutterTts = FlutterTts();
  void _speak(String courseName) async {
    String text = 'default';
    try {
      // Correct the asset path
      final String assetPath = 'lib/assets/texts/$courseName.txt';

      // Read the file from assets
      text = await rootBundle.loadString(assetPath);
    } catch (e) {
      // Print the error for debugging
      print("Error reading file: $e");
    }

    // Speak the text
    await flutterTts.speak(text);
  }

  // Opens a dialog on tap with course information and a 'Begin' button.
  // Uses the showDialog function and a FutureBuilder to load course text.
  Widget buildCourseButton(String courseName) {
    return SizedBox(
      width: MediaQuery.of(context).size.width * 0.40,
      height: MediaQuery.of(context).size.width * 0.40,
      child: ElevatedButton(
        onPressed: () {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return Dialog(
                backgroundColor: Theme.of(context).colorScheme.secondary,
                insetPadding: EdgeInsets.only(
                  top: MediaQuery.of(context).size.height * 0.1,
                  bottom: MediaQuery.of(context).size.height * 0.1,
                  left: MediaQuery.of(context).size.width * 0.05,
                  right: MediaQuery.of(context).size.width * 0.05,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20.0),
                ),
                child: FutureBuilder(
                  future: loadTextFile(courseName),
                  builder:
                      (BuildContext context, AsyncSnapshot<String> snapshot) {
                    if (snapshot.connectionState == ConnectionState.done) {
                      if (snapshot.hasError) {
                        return Text('Error: ${snapshot.error}');
                      }
                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Expanded(
                            child: CustomScrollView(
                              slivers: <Widget>[
                                SliverAppBar(
                                  pinned: true,
                                  expandedHeight: 200.0,
                                  backgroundColor:
                                      Theme.of(context).colorScheme.primary,
                                  flexibleSpace: FlexibleSpaceBar(
                                    title: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            courseName,
                                            style: TextStyle(
                                              fontSize: 24,
                                              fontWeight: FontWeight.bold,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                        ),
                                        IconButton(
                                          icon: Icon(Icons.volume_up),
                                          color: Colors.white,
                                          onPressed: () {
                                            _speak(courseName);
                                          },
                                        ),
                                      ],
                                    ),
                                    background: Image.asset(
                                      'lib/assets/images/$courseName.png',
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                SliverToBoxAdapter(
                                  child: Container(
                                    padding: EdgeInsets.all(20),
                                    child: Text(
                                      snapshot.data ?? 'No content available',
                                      textAlign: TextAlign.left,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: EdgeInsets.all(5),
                            child: ElevatedButton(
                              onPressed: () {
                                Navigator.of(context).pop();
                                navigateToCoursePage(courseName);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor:
                                    Theme.of(context).colorScheme.primary,
                                foregroundColor:
                                    Theme.of(context).colorScheme.onSecondary,
                                minimumSize: Size(250, 50),
                              ),
                              child: Text('Begin',
                                  style: TextStyle(
                                    color: Theme.of(context)
                                        .colorScheme
                                        .onSecondary,
                                  )),
                            ),
                          ),
                        ],
                      );
                    } else {
                      return Center(child: CircularProgressIndicator());
                    }
                  },
                ),
              );
            },
          );
        },
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          backgroundColor: Colors.transparent,
          padding: EdgeInsets.zero,
          elevation: 0,
          shadowColor: Colors.transparent,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Image.asset(
            'lib/assets/images/$courseName.png',
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) {
              return Image.asset('lib/assets/images/BulbyWattson.png',
                  fit: BoxFit.contain);
            },
          ),
        ),
      ),
    );
  }

  Future<String> loadTextFile(String courseName) async {
    String fileString = 'lib/assets/texts/default.txt';
    try {
      return await rootBundle.loadString('lib/assets/texts/$courseName.txt');
    } catch (e) {
      fileString = 'lib/assets/texts/default.txt';
    }
    return await rootBundle.loadString(fileString);
  }
}

class PlaceholderWidget extends StatelessWidget {
  final Color color;

  PlaceholderWidget({required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: color,
    );
  }
}

class CourseConfig {
  final Color backgroundColor;
  final Color buttonColor;

  CourseConfig({required this.backgroundColor, required this.buttonColor});
}
