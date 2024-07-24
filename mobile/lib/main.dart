import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:namer_app/assets/themes/theme_setup.dart';
import 'dart:math';
import 'use_api.dart';
import 'homepage.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SharedPreferences prefs = await SharedPreferences.getInstance();
  String selectedThemeIdentifier = prefs.getString('selectedTheme') ?? 'Ocean';
  ThemeData initialTheme = themes[selectedThemeIdentifier] ?? themes['Ocean']!;

  runApp(
    ChangeNotifierProvider(
      create: (_) => ThemeNotifier(initialTheme),
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final themeNotifier = Provider.of<ThemeNotifier>(context);

    return MaterialApp(
      title: 'Flutter Demo',
      theme: themeNotifier.theme,
      home: LoginPage(), // Replace with your login page
    );
  }
}

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // Text editing controllers for username and password
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // API service instance
  final ApiService _apiService = ApiService();

  void showErrorDialog(String message) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Error'),
        content: Text(message),
        actions: <Widget>[
          ElevatedButton(
            child: Text('OK'),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ],
      ),
    );
  }

  String getRandomImagePath() {
    List<String> images = [
      "lib/assets/images/login/1.png",
      "lib/assets/images/login/2.png",
      "lib/assets/images/login/3.png",
      "lib/assets/images/login/4.png",
      "lib/assets/images/login/5.png",
      "lib/assets/images/login/6.png",
      "lib/assets/images/login/7.png",
      "lib/assets/images/login/8.png",
    ];
    Random random = Random();
    int index = random.nextInt(images.length);
    return images[index];
  }

  Future<void> saveUserEmail(String email) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('userEmail', email);
  }

  // Function to handle the login process
  Future<void> _handleLogin() async {
    final String email = _emailController.text.trim();
    final String password = _passwordController.text;

    try {
      // final payload = {
      //   "email": email,
      //   "password": password,
      //   "remember": false,
      // };
      final payload = {
        "email": "marylove.gurrieri@stemrocks.org",
        "password": "HotDogsRule-24",
        "remember": false,
      };
      // In _handleLogin method:
      final response = await _apiService.signInStepOne(payload);
      await saveUserEmail(email);

      // Navigate to HomePage without passing user data
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) => HomePage(),
        ),
      );
    } catch (e) {
      print(e.toString());
      showErrorDialog('Incorrect email address or password.');
    }
  }

  @override
  Widget build(BuildContext context) {
    String randomImagePath = getRandomImagePath();

    return Scaffold(
      body: Stack(
        children: [
          // Background image for the login page.
          Positioned.fill(
            child: Image.asset(
              randomImagePath,
              fit: BoxFit.cover,
            ),
          ),
          // Container holding the login form.
          Positioned(
            bottom: 50,
            left: 0,
            right: 0,
            child: Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                // Replace the fixed height with a percentage of the screen height
                height: MediaQuery.of(context).size.height *
                    0.4, // 40% of screen height
                padding: EdgeInsets.all(20.0),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 66, 66, 66).withOpacity(0.9),
                  borderRadius: BorderRadius.circular(10),
                ),
                width: MediaQuery.of(context).size.width * 0.85,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: _buildLoginFields(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildLoginFields() {
    return <Widget>[
      TextField(
        controller: _emailController,
        decoration: InputDecoration(
          filled: true,
          fillColor: Colors.white,
          prefixIcon: Icon(Icons.person),
          hintText: 'Email Address',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(50),
          ),
        ),
        style: TextStyle(fontFamily: 'RobotoMono'),
      ),
      SizedBox(height: 10),
      TextField(
        controller: _passwordController,
        obscureText: true,
        decoration: InputDecoration(
          filled: true,
          fillColor: Colors.white,
          prefixIcon: Icon(Icons.lock),
          hintText: 'Password',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(50),
          ),
        ),
        style: TextStyle(fontFamily: 'RobotoMono'),
      ),
      Padding(
        padding: EdgeInsets.only(top: 10.0),
        child: SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _handleLogin,
            style: ElevatedButton.styleFrom(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(50),
              ),
            ),
            child: Text(
              'LOGIN',
              style: TextStyle(fontFamily: 'RobotoMono'),
            ),
          ),
        ),
      ),
      SizedBox(height: 10),
      Image.asset(
        "lib/assets/images/brief_logo_1.png",
        height: 80,
      ),
    ];
  }
}

class ThemeNotifier with ChangeNotifier {
  ThemeData _currentTheme;

  ThemeNotifier(this._currentTheme);

  ThemeData get theme => _currentTheme;

  setTheme(ThemeData theme) {
    _currentTheme = theme;
    notifyListeners();
  }
}
