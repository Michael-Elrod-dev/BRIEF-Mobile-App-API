import 'package:flutter/material.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';

class YouTubeScreen extends StatefulWidget {
  final String courseName;

  YouTubeScreen({Key? key, required this.courseName}) : super(key: key);

  @override
  _YouTubeScreenState createState() => _YouTubeScreenState();
}

class _YouTubeScreenState extends State<YouTubeScreen> {
  late List<String> videoIds;
  late List<String> videoTitles;

  @override
  void initState() {
    super.initState();
    // var theme = Theme.of(context);
    // Customize video data based on courseName
    switch (widget.courseName) {
      case 'HTML':
        videoIds = ['ciio80nkjB8', 'SThwp5ijh6o', 'xCxI2GIFdZo'];
        videoTitles = ['HTML Video 1', 'HTML Video 2', 'HTML Video 3'];
        break;
      case 'C++':
        videoIds = ['AYSISa95oJE', 'xCxI2GIFdZo', 'xCxI2GIFdZo'];
        videoTitles = ['C++ Video 1', 'C++ Video 2', 'C++ Video 3'];
        break;
      case 'Java':
        videoIds = ['AYSISa95oJE', 'xCxI2GIFdZo', 'xCxI2GIFdZo'];
        videoTitles = ['Java Video 1', 'Java Video 2', 'Java Video 3'];
        break;
      case 'JavaScript':
        videoIds = ['ciio80nkjB8', 'SThwp5ijh6o', 'xCxI2GIFdZo'];
        videoTitles = [
          'JavaScript Video 1',
          'JavaScript Video 2',
          'JavaScript Video 3'
        ];
        break;
      case 'Python':
        videoIds = ['AYSISa95oJE', 'xCxI2GIFdZo', 'xCxI2GIFdZo'];
        videoTitles = ['Python Video 1', 'Python Video 2', 'Python Video 3'];
        break;
      case 'RaspberryPi':
        videoIds = ['ciio80nkjB8', 'SThwp5ijh6o', 'xCxI2GIFdZo'];
        videoTitles = [
          'RaspberryPi Video 1',
          'RaspberryPi Video 2',
          'RaspberryPi Video 3'
        ];
        break;
      // Add cases for other courses
      default:
        videoIds = [];
        videoTitles = [];
    }
  }

  String getThumbnailUrl(String videoId) {
    return 'https://img.youtube.com/vi/$videoId/0.jpg';
  }

  Widget buildVideoItem(String videoId, String title) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => VideoPlayerScreen(videoId: videoId),
          ),
        );
      },
      child: SizedBox(
        width: double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Image.network(
              getThumbnailUrl(videoId),
              width: double.infinity,
              fit: BoxFit.cover,
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(title,
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color:
                        Theme.of(context).colorScheme.background == Colors.white
                            ? Colors.black
                            : Theme.of(context).colorScheme.onSecondary,
                  )),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: ListView.builder(
        itemCount: videoIds.length,
        itemBuilder: (context, index) {
          return buildVideoItem(videoIds[index], videoTitles[index]);
        },
      ),
    );
  }
}

class VideoPlayerScreen extends StatefulWidget {
  final String videoId;

  VideoPlayerScreen({required this.videoId});

  @override
  _VideoPlayerScreenState createState() => _VideoPlayerScreenState();
}

class _VideoPlayerScreenState extends State<VideoPlayerScreen> {
  late YoutubePlayerController _controller;
  bool _isFullscreen = false;

  @override
  void initState() {
    super.initState();
    _controller = YoutubePlayerController(
      initialVideoId: widget.videoId,
      flags: YoutubePlayerFlags(
        autoPlay: true,
        mute: false,
      ),
    );

    _controller.addListener(() {
      if (_controller.value.isFullScreen != _isFullscreen) {
        setState(() {
          _isFullscreen = _controller.value.isFullScreen;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return OrientationBuilder(
      builder: (context, orientation) {
        _isFullscreen = orientation == Orientation.landscape;

        return Scaffold(
          appBar: _isFullscreen
              ? null
              : AppBar(
                  title: Text(
                    'Video',
                    style: TextStyle(
                      color: Theme.of(context).colorScheme.onSecondary,
                    ),
                  ),
                ),
          body: YoutubePlayer(
            controller: _controller,
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
