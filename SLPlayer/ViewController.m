//
//  ViewController.m
//  SLPlayer
//
//  Created by YHL on 2017/10/25.
//  Copyright © 2017年 l.t.zero. All rights reserved.
//

#import "ViewController.h"
#import <IJKMediaFramework/IJKMediaFramework.h>

@interface ViewController ()

@property(nonatomic,strong)IJKFFMoviePlayerController *moviePlayer;

@end

@implementation ViewController{
}

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    IJKFFOptions *option = [IJKFFOptions optionsByDefault];
    //静音设置
    [option setPlayerOptionValue:@"0" forKey:@"an"];
    // 开启硬解码
    [option setPlayerOptionValue:@"1" forKey:@"videotoolbox"];
    
    IJKFFMoviePlayerController *moviePlayer = [[IJKFFMoviePlayerController alloc] initWithContentURLString:@"http://lvod1.hefantv.com/record/live1/1603874hefan20170610231712_0.m3u8" withOptions:option];
    self.moviePlayer = moviePlayer;
    [self.view addSubview:self.moviePlayer.view];
    self.moviePlayer.view.frame = self.view.bounds;
    self.moviePlayer.scalingMode = IJKMPMovieScalingModeAspectFill;
    
    //这里是自动播放，所以就没有[self.player play]这句话~
    self.moviePlayer.shouldAutoplay = YES;
    
    [self.moviePlayer prepareToPlay];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
