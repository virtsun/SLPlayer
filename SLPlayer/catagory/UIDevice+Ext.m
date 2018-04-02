//
//  UIDevice+Ext.m
//  funlive
//
//  Created by l.t.zero on 16/8/18.
//  Copyright © 2016年 renzhen. All rights reserved.
//

#import "UIDevice+Ext.h"

#import <sys/sysctl.h>

@implementation UIDevice(Ext)

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
 */

+ (BOOL)beforePlatform:(NSUInteger)version{
    NSString *platform = [UIDevice platform];
    
    if ([platform isEqualToString:@"iPhone se"]){
        return version >= 5;
    }
    
    if ([platform hasPrefix:@"iPhone"]){
        
        NSString *p = [platform substringWithRange:NSMakeRange(7, 1)];
        return p.integerValue <= version;
    }
    
    return NO;
}

+ (BOOL)iPhoneX{
#if TARGET_IPHONE_SIMULATOR
    return CGSizeEqualToSize([UIScreen mainScreen].bounds.size, CGSizeMake(375, 812))
    || CGSizeEqualToSize([UIScreen mainScreen].bounds.size, CGSizeMake(812, 375));
#else
    return [[self platform] isEqualToString:@"iPhone X"];
#endif
}

+ (NSString *)platform{
     size_t size;
     sysctlbyname("hw.machine", NULL, &size, NULL, 0);
     char *machine = malloc(size);
     sysctlbyname("hw.machine", machine, &size, NULL, 0);
     NSString *platform = [NSString stringWithCString:machine encoding:NSUTF8StringEncoding];
     free(machine);
    
    if ([platform isEqualToString:@"iPhone1,1"]) return @"iPhone 2G";
    if ([platform isEqualToString:@"iPhone1,2"]) return @"iPhone 3G";
    if ([platform isEqualToString:@"iPhone2,1"]) return @"iPhone 3GS";
    if ([platform isEqualToString:@"iPhone3,1"]) return @"iPhone 4";
    if ([platform isEqualToString:@"iPhone3,2"]) return @"iPhone 4";
    if ([platform isEqualToString:@"iPhone3,3"]) return @"iPhone 4";
    if ([platform isEqualToString:@"iPhone4,1"]) return @"iPhone 4S";
    if ([platform isEqualToString:@"iPhone5,1"]) return @"iPhone 5";
    if ([platform isEqualToString:@"iPhone5,2"]) return @"iPhone 5";
    if ([platform isEqualToString:@"iPhone5,3"]) return @"iPhone 5c";
    if ([platform isEqualToString:@"iPhone5,4"]) return @"iPhone 5c";
    if ([platform isEqualToString:@"iPhone6,1"]) return @"iPhone 5s";
    if ([platform isEqualToString:@"iPhone6,2"]) return @"iPhone 5s";
    if ([platform isEqualToString:@"iPhone7,1"]) return @"iPhone 6 Plus";
    if ([platform isEqualToString:@"iPhone7,2"]) return @"iPhone 6";
    if ([platform isEqualToString:@"iPhone8,1"]) return @"iPhone 6s";
    if ([platform isEqualToString:@"iPhone8,2"]) return @"iPhone 6s Plus";
    if ([platform isEqualToString:@"iPhone8,4"]) return @"iPhone se";
    if ([platform isEqualToString:@"iPhone9,1"]) return @"iPhone 7";
    if ([platform isEqualToString:@"iPhone9,2"]) return @"iPhone 7 Plus";
    if ([platform isEqualToString:@"iPhone10,1"]) return @"iPhone 8";
    if ([platform isEqualToString:@"iPhone10,4"]) return @"iPhone 8";
    if ([platform isEqualToString:@"iPhone10,2"]) return @"iPhone 8 Plus";
    if ([platform isEqualToString:@"iPhone10,5"]) return @"iPhone 8 Plus";
    if ([platform isEqualToString:@"iPhone10,3"]) return @"iPhone 8 Plus";
    if ([platform isEqualToString:@"iPhone10,6"]) return @"iPhone X";
    
    if ([platform isEqualToString:@"iPod1,1"]) return @"iPod Touch 1G";
    if ([platform isEqualToString:@"iPod2,1"])return @"iPod Touch 2G";
    if ([platform isEqualToString:@"iPod3,1"])return @"iPod Touch 3G";
    if ([platform isEqualToString:@"iPod4,1"])return @"iPod Touch 4G";
    if ([platform isEqualToString:@"iPod5,1"])return @"iPod Touch 5G";
    if ([platform isEqualToString:@"iPod7,1"])return @"iPod Touch 6G";

    if ([platform isEqualToString:@"iPad2,5"]) return @"iPad Mini 1";
    if ([platform isEqualToString:@"iPad2,6"]) return @"iPad Mini 1";
    if ([platform isEqualToString:@"iPad2,7"]) return @"iPad Mini 1";
    if ([platform isEqualToString:@"iPad4,4"]) return @"iPad Mini 2";
    if ([platform isEqualToString:@"iPad4,5"]) return @"iPad Mini 2";
    if ([platform isEqualToString:@"iPad4,6"]) return @"iPad Mini 2";
    if ([platform isEqualToString:@"iPad4,7"]) return @"iPad Mini 3";
    if ([platform isEqualToString:@"iPad4,8"]) return @"iPad Mini 3";
    if ([platform isEqualToString:@"iPad4,9"]) return @"iPad Mini 3";
    if ([platform isEqualToString:@"iPad5,1"]) return @"iPad Mini 4";
    if ([platform isEqualToString:@"iPad5,2"]) return @"iPad Mini 4";
    
    
    if ([platform isEqualToString:@"iPad1,1"])return @"iPad 1G";
    if ([platform isEqualToString:@"iPad2,1"])return @"iPad 2";
    if ([platform isEqualToString:@"iPad2,2"])return @"iPad 2";
    if ([platform isEqualToString:@"iPad2,3"]) return @"iPad 2";
    if ([platform isEqualToString:@"iPad2,4"]) return @"iPad 2";
    if ([platform isEqualToString:@"iPad3,1"]) return @"iPad 3";
    if ([platform isEqualToString:@"iPad3,2"]) return @"iPad 3";
    if ([platform isEqualToString:@"iPad3,3"]) return @"iPad 3";
    if ([platform isEqualToString:@"iPad3,4"]) return @"iPad 4";
    if ([platform isEqualToString:@"iPad3,5"]) return @"iPad 4";
    if ([platform isEqualToString:@"iPad3,6"]) return @"iPad 4";
    if ([platform isEqualToString:@"iPad4,1"]) return @"iPad Air";
    if ([platform isEqualToString:@"iPad4,2"]) return @"iPad Air";
    if ([platform isEqualToString:@"iPad4,3"]) return @"iPad Air";
    if ([platform isEqualToString:@"iPad5,3"]) return @"iPad Air";
    if ([platform isEqualToString:@"iPad5,4"]) return @"iPad Air 2";
    if ([platform isEqualToString:@"iPad6,11"]) return @"iPad 5";
    if ([platform isEqualToString:@"iPad6,12"]) return @"iPad 5";
 
    if ([platform isEqualToString:@"iPad6,3"]) return @"iPad Pro 9.7 Inch";
    if ([platform isEqualToString:@"iPad6,4"]) return @"iPad Pro 9.7 Inch";
    if ([platform isEqualToString:@"iPad6,7"]) return @"iPad Pro 12.9 Inch";
    if ([platform isEqualToString:@"iPad6,8"]) return @"iPad Pro 12.9 Inch";
   
    if ([platform isEqualToString:@"iPad7,1"]) return @"iPad Pro 12.9 Inch 2. Generation";
    if ([platform isEqualToString:@"iPad7,2"]) return @"iPad Pro 12.9 Inch 2. Generation";
    if ([platform isEqualToString:@"iPad7,3"]) return @"iPad Pro 10.5 Inch";
    if ([platform isEqualToString:@"iPad7,4"]) return @"iPad Pro 10.5 Inch";
  
    if ([platform isEqualToString:@"AppleTV5,3"]) return @"Apple TV";
    if ([platform isEqualToString:@"AppleTV6,2"]) return @"Apple TV 4K";
    
    if ([platform isEqualToString:@"AudioAccessory1,1"]) return @"HomePod";

    
    if ([platform isEqualToString:@"i386"]) return @"iPhone Simulator";
    if ([platform isEqualToString:@"x86_64"]) return @"iPhone Simulator";
    
     return platform;
 }

- (NSInteger)availableVersion:(NSString *)version{
    NSArray *currentSystemVersion = [self.systemVersion componentsSeparatedByString:@"."];
    NSArray *comparedVersion = [version componentsSeparatedByString:@"."];
    
    NSInteger compared = 0;
    for(size_t i = 0; i < MIN(currentSystemVersion.count, comparedVersion.count); i++){
        NSInteger vCurrent = [currentSystemVersion[i] integerValue];
        NSInteger vCompared = [comparedVersion[i] integerValue];
        
        if ((compared = (vCompared - vCurrent)) != 0){
            break;
        }
    }
    
    return compared == 0? (comparedVersion.count - currentSystemVersion.count):compared;
}

@end
