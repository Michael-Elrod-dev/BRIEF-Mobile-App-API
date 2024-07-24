import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'main.dart';
import 'use_api.dart';
import 'data.dart';
import 'dart:convert';

class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  User? user;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  void _loadUserData() async {
    ApiService apiService = ApiService();

    try {
      // Fetch user data from the API
      User? apiUser = await apiService.getUser();

      if (apiUser != null) {
        // Update local user object
        setState(() {
          user = apiUser;
        });

        // Update shared preferences with the new data
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('userData', json.encode(apiUser.toJson()));
      } else {
        // Handle case when user data is not available from API
        print("User data not available from API");
      }
    } catch (e) {
      print('Error fetching user data from API: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
      ),
      backgroundColor: Theme.of(context).colorScheme.background,
      body: buildProfileComponents(),
    );
  }

  Widget buildProfileComponents() {
    if (user == null) {
      return Center(child: CircularProgressIndicator());
    }

    String formattedDateJoined = formatJoinedDate(user!.dateJoined);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Padding(
                  padding: EdgeInsets.only(left: 20.0, bottom: 10),
                  child: CircleAvatar(
                    radius: 50,
                    backgroundImage:
                        AssetImage('lib/assets/images/bulbyprofile.png'),
                  ),
                ),
                SizedBox(width: 40),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${user!.firstName} ${user!.lastName}',
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Theme.of(context).colorScheme.background ==
                                    Colors.white
                                ? Colors
                                    .black // Text color is black if background is white
                                : Theme.of(context).colorScheme.onSecondary,
                          )),
                      SizedBox(height: 5),
                      Text(user!.suiteEmail,
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.background ==
                                    Colors.white
                                ? Colors
                                    .black // Text color is black if background is white
                                : Theme.of(context).colorScheme.onSecondary,
                          )),
                      SizedBox(height: 5),
                      Text('Joined $formattedDateJoined',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.background ==
                                    Colors.white
                                ? Colors
                                    .black // Text color is black if background is white
                                : Theme.of(context).colorScheme.onSecondary,
                          )),
                    ],
                  ),
                )
              ],
            ),
            Divider(
              color: Theme.of(context).colorScheme.primary,
              thickness: 1.0,
            ),
            SizedBox(height: 10),
            Text('Statistics',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.background ==
                          Colors.white
                      ? Colors
                          .black // Text color is black if background is white
                      : Theme.of(context).colorScheme.onSecondary,
                )),
            SizedBox(height: 20),
            buildStatisticsSection(),
            Divider(
                color: Theme.of(context).colorScheme.primary, thickness: 1.0),
            SizedBox(height: 10),
            Text('Achievements',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.background ==
                          Colors.white
                      ? Colors
                          .black // Text color is black if background is white
                      : Theme.of(context).colorScheme.onSecondary,
                )),
            SizedBox(height: 20),
            buildAchievementsSection(),
          ],
        ),
      ),
    );
  }

  Widget buildStatisticsSection() {
    return Center(
      child: Wrap(
        alignment: WrapAlignment.center,
        spacing: 20,
        runSpacing: 20,
        children: [
          _buildBadge(context, '${user!.streak} day streak', Icons.flash_on,
              color: Colors.red),
          _buildBadge(context, '${user!.totalStreak} total streak', Icons.stars,
              color: Colors.green),
          _buildBadge(context, '${user!.coursesComplete} courses', Icons.book,
              color: Colors.blue),
          _buildBadge(context, '${user!.assignmentIDs.length} assignments',
              Icons.verified,
              color: Colors.purple),
          _buildBadge(context, '${user!.mastery} points', Icons.paid,
              color: Colors.yellow),
          // ... Add more badges as needed ...
        ],
      ),
    );
  }

  Widget buildAchievementsSection() {
    return Center(
      child: Wrap(
        alignment: WrapAlignment.center,
        spacing: 20,
        runSpacing: 20,
        children: [
          _buildBadge(context, '${user!.totalStreak} day streak', Icons.stars,
              color: Colors.red),
          _buildBadge(context, '${user!.rewardsComplete} rewards', Icons.star,
              color: Colors.yellow),
          // ... Add more badges as needed ...
        ],
      ),
    );
  }

  Widget _buildBadge(BuildContext context, String text, IconData icon,
      {Color? color}) {
    var theme = Provider.of<ThemeNotifier>(context).theme;
    bool isDefaultTheme = theme.colorScheme.primary == Color(0xFF005A9C);

    Color iconColor;
    if (isDefaultTheme) {
      iconColor = color ?? theme.colorScheme.secondary;
    } else {
      iconColor = theme.colorScheme.secondary;
    }

    Color badgeColor = theme.colorScheme.primary;
    Color shadowColor = Colors.grey.withOpacity(0.2);

    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20.0),
        color: badgeColor,
        boxShadow: [
          BoxShadow(
            color: shadowColor,
            spreadRadius: 1,
            blurRadius: 1,
            offset: Offset(0, 1),
          ),
        ],
      ),
      width: 160,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 40.0, color: iconColor),
          SizedBox(height: 5),
          Text(text,
              textAlign: TextAlign.center,
              style: TextStyle(
                  fontSize: 16, color: theme.colorScheme.onSecondary)),
          SizedBox(height: 10),
        ],
      ),
    );
  }
}

String formatJoinedDate(String dateJoined) {
  try {
    DateTime parsedDate = DateTime.parse(dateJoined);

    String formattedDate = DateFormat('MMMM dd, yyyy').format(parsedDate);

    String dayWithSuffix = _addDaySuffix(parsedDate.day);
    formattedDate = formattedDate.replaceFirst(RegExp(r'\d+'), dayWithSuffix);

    return formattedDate;
  } catch (e) {
    print('Error parsing date: $dateJoined - $e');
    return 'Invalid Date';
  }
}

String _addDaySuffix(int day) {
  if (!(day >= 1 && day <= 31)) {
    return day.toString();
  }

  if (day >= 11 && day <= 13) {
    return '${day}th';
  }

  switch (day % 10) {
    case 1:
      return '${day}st';
    case 2:
      return '${day}nd';
    case 3:
      return '${day}rd';
    default:
      return '${day}th';
  }
}
