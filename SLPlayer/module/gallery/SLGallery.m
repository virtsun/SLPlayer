//
//  SLGallery.m
//  SLPlayer
//
//  Created by YHL on 2017/10/26.
//  Copyright © 2017年 l.t.zero. All rights reserved.
//

#import "SLGallery.h"


@implementation SLGallery

//遍历相册
/**
 *  遍历相簿中的所有图片
 *  @param assetCollection 相簿
 *  @param original        是否要原图
 */
+ (void)enumerateAssetsInAssetCollection:(PHAssetCollection *)assetCollection original:(BOOL)original
{
    
    PHImageRequestOptions *options = [[PHImageRequestOptions alloc] init];
    // 同步获得图片, 只会返回1张图片
    options.synchronous = YES;
    
    // 获得某个相簿中的所有PHAsset对象
    PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:assetCollection options:nil];
    for (PHAsset *asset in assets) {
        @autoreleasepool {
            // 是否要原图
            CGSize size = original ? CGSizeMake(asset.pixelWidth, asset.pixelHeight) : CGSizeZero;
            
            // 从asset中获得图片
            [[PHImageManager defaultManager] requestImageForAsset:asset targetSize:size contentMode:PHImageContentModeDefault options:options resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
                // result为获得的图片
            }];
        }
    }
}

+ (void)requestAuthorizedAndFetchPhotos:(void (^)(NSArray<PHAsset*> *))completion{
    if (PHAuthorizationStatusAuthorized != [PHPhotoLibrary authorizationStatus]){
        [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
            if (status == PHAuthorizationStatusAuthorized){
                if (completion){
                    completion([self getOriginalImages]);
                }
            }
        }];
    }else{
        if (completion){
            completion([self getOriginalImages]);
        }
    }
}
+ (void)fetchImageWithPHAsset:(PHAsset *)asset completed:(void (^)(UIImage * _Nullable result, NSDictionary * _Nullable info))completion{
    PHImageRequestOptions *options = [[PHImageRequestOptions alloc] init];
    // 同步获得图片, 只会返回1张图片
    options.synchronous = YES;
    BOOL original = YES;
    
    CGSize size = original ? CGSizeMake(asset.pixelWidth, asset.pixelHeight) : CGSizeZero;
    
    // 从asset中获得图片
    [[PHImageManager defaultManager] requestImageForAsset:asset targetSize:size contentMode:PHImageContentModeDefault options:options resultHandler:^(UIImage * _Nullable result, NSDictionary * _Nullable info) {
        // result为获得的图片
        if (completion){
            completion(result, info);
        }
    }];
    
}
//获得所有相簿的原图
+ (NSArray<PHAsset*> *)getOriginalImages
{
    @autoreleasepool {
        
        //PHAssetCollectionSubtypeAlbumRegular,自定义相册
        //PHAssetCollectionSubtypeAlbumSyncedAlbum，通过iTunes同步过来的相册
        // 获得所有的自定义相簿
        PHFetchResult<PHAssetCollection *> *assetCollections = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeAlbum subtype:PHAssetCollectionSubtypeAlbumSyncedAlbum options:nil];
        // 遍历所有的自定义相簿
        
        NSMutableArray<PHAsset*> *array = [@[] mutableCopy];
        for (PHAssetCollection *assetCollection in assetCollections) {
            PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:assetCollection options:nil];
            for (PHAsset *asset in assets){
                [array addObject:asset];
            }
        }
        
        // 获得相机胶卷
        PHAssetCollection *cameraRoll = [PHAssetCollection fetchAssetCollectionsWithType:PHAssetCollectionTypeSmartAlbum subtype:PHAssetCollectionSubtypeSmartAlbumUserLibrary options:nil].lastObject;
        // 遍历相机胶卷,获取大图
        //    [self enumerateAssetsInAssetCollection:cameraRoll original:YES];
        
        PHFetchResult<PHAsset *> *assets = [PHAsset fetchAssetsInAssetCollection:cameraRoll options:nil];
        
        for (PHAsset *asset in assets){
            [array addObject:asset];
        }
        return array;
    }
}


@end
