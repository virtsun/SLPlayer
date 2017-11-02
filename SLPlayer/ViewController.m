//
//  ViewController.m
//  SLPlayer
//
//  Created by L.T.ZERO on 2017/10/25.
//  Copyright © 2017年 l.t.zero. All rights reserved.
//

#import "ViewController.h"
#import "UINavigationController+FDFullscreenPopGesture.h"
#import "UIViewController+Navigation.h"
#import "macro.h"

#import "SLGalleryView.h"
#import "SLHamburgerButton.h"
#import <CLImageEditor/CLImageEditor.h>

@interface ViewController ()<SLGalleryViewDelegate>

//@property(nonatomic,strong)IJKFFMoviePlayerController *moviePlayer;

@end

@implementation ViewController{
}



- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    self.navigationItem.title = @"SLPlayer";
    ;

    [self.navigationController.navigationBar setTitleTextAttributes:
            @{NSFontAttributeName:[UIFont fontWithName:@"Chalkduster" size:18],
                    NSForegroundColorAttributeName:[UIColor blackColor]}];

    [self clearNavigationBarBackgroundColor];

    SLHamburgerButton *hamburger = [[SLHamburgerButton alloc] initWithFrame:CGRectMake(0, 0, 54, 54)];
    hamburger.tintColor = [UIColor blackColor];
    hamburger.transform = CGAffineTransformMakeScale(0.6f, 0.6f);
    [hamburger addTarget:self action:@selector(hamburgerClick:) forControlEvents:UIControlEventTouchUpInside];
    self.navigationItem.leftBarButtonItems = @[[[UIBarButtonItem alloc] initWithCustomView:hamburger]];

//
//    IJKFFOptions *option = [IJKFFOptions optionsByDefault];
//    //静音设置
//    [option setPlayerOptionValue:@"0" forKey:@"an"];
//    // 开启硬解码
//    [option setPlayerOptionValue:@"1" forKey:@"videotoolbox"];
//    
//    IJKFFMoviePlayerController *moviePlayer = [[IJKFFMoviePlayerController alloc] initWithContentURLString:@"http://lvod1.hefantv.com/record/live1/1603874hefan20170610231712_0.m3u8" withOptions:option];
//    self.moviePlayer = moviePlayer;
//    [self.view addSubview:self.moviePlayer.view];
//    self.moviePlayer.view.frame = self.view.bounds;
//    self.moviePlayer.scalingMode = IJKMPMovieScalingModeAspectFill;
//    
//    //这里是自动播放，所以就没有[self.player play]这句话~
//    self.moviePlayer.shouldAutoplay = YES;
//    
//    [self.moviePlayer prepareToPlay];


    SLGalleryView *gallery = [[SLGalleryView alloc] init];
    gallery.frame = self.view.bounds;
    gallery.delegate = self;
    [self.view addSubview:gallery];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)hamburgerClick:(SLHamburgerButton *)sender{
    sender.selected = !sender.selected;
    
    UIViewController *test = [[UIViewController alloc] init];
    test.view.backgroundColor = UIColorFromRGB(0xffffff);
    
    [self.navigationController pushViewController:test animated:YES];
    
}

#pragma mark --
#pragma mark -- SLGalleryView
- (void)SLGallery:(SLGalleryView *)gallery didSelectedItem:(PHAsset *)asset{
    [SLGallery fetchImageWithPHAsset:asset
                           completed:^(UIImage * _Nullable image, NSDictionary * _Nullable info) {
                               dispatch_main_async_safe(^{
                                   CLImageEditor *editor = [[CLImageEditor alloc] initWithImage:image];
                           //        editor.delegate = self;
                                   
                                   [self.navigationController pushViewController:editor animated:YES];
                               });
                           }];
}

@end
