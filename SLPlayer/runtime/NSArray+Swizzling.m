//
//  NSMutableArray+Swizzling.m
//  RuntimeDemo
//
//  Created by huangyibiao on 16/1/12.
//  Copyright © 2016年 huangyibiao. All rights reserved.
//

#import "NSArray+Swizzling.h"
#import <objc/runtime.h>
#import "NSObject+Swizzling.h"

#define RAISEARRAYEXCEPTIONREASON(...) [self raiseException:[NSString stringWithFormat:__VA_ARGS__]]

NSString *const NotificationArrayExceptionName = @"__NotificationArrayExceptionName__";

@implementation NSArray (Swizzling)

+ (void)load {
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    [self swizzleSelector:@selector(removeObject:)
     withSwizzledSelector:@selector(hdf_safeRemoveObject:)];

    [objc_getClass("__NSArrayM") swizzleSelector:@selector(addObject:)
     withSwizzledSelector:@selector(hdf_safeAddObject:)];
    [objc_getClass("__NSArrayM") swizzleSelector:@selector(removeObjectAtIndex:)
                            withSwizzledSelector:@selector(hdf_safeRemoveObjectAtIndex:)];

    [objc_getClass("__NSArrayM") swizzleSelector:@selector(insertObject:atIndex:)
     withSwizzledSelector:@selector(hdf_insertObject:atIndex:)];

    [objc_getClass("__NSPlaceholderArray") swizzleSelector:@selector(initWithObjects:count:) withSwizzledSelector:@selector(hdf_initWithObjects:count:)];
    
    [objc_getClass("__NSSingleObjectArrayI") swizzleSelector:@selector(objectAtIndex:) withSwizzledSelector:@selector(hdf_objectAtIndex:)];
    [objc_getClass("__NSArrayI") swizzleSelector:@selector(objectAtIndex:) withSwizzledSelector:@selector(hdfI_objectAtIndex:)];
    [objc_getClass("__NSArrayM") swizzleSelector:@selector(objectAtIndex:) withSwizzledSelector:@selector(hdfM_objectAtIndex:)];

  });
}

- (instancetype)hdf_initWithObjects:(const id  _Nonnull *)objects count:(NSUInteger)cnt {

    @autoreleasepool {
        BOOL hasNilObject = NO;
        for (NSUInteger i = 0; i < cnt; i++) {
            if (objects[i] == nil) {
                hasNilObject = YES;
                RAISEARRAYEXCEPTIONREASON(@"%s object at index %lu is nil, it will be filtered", __FUNCTION__, i);
            }
        }

        // 因为有值为nil的元素，那么我们可以过滤掉值为nil的元素
        if (hasNilObject) {
            id __unsafe_unretained newObjects[cnt];

            NSUInteger index = 0;
            for (NSUInteger i = 0; i < cnt; ++i) {
                if (objects[i] != nil) {
                    newObjects[index++] = objects[i];
                }
            }

            RAISEARRAYEXCEPTIONREASON(@"%s has nil object", __FUNCTION__);
            return [self hdf_initWithObjects:newObjects count:index];
        }
    }

  return [self hdf_initWithObjects:objects count:cnt];
}


- (void)hdf_safeAddObject:(id)obj {
  if (obj == nil) {
    RAISEARRAYEXCEPTIONREASON(@"%s can add nil object into NSMutableArray", __FUNCTION__);
  } else {
    [self hdf_safeAddObject:obj];
  }
}

- (void)hdf_safeRemoveObject:(id)obj {
  if (obj == nil) {
    RAISEARRAYEXCEPTIONREASON(@"%s call -removeObject:, but argument obj is nil", __FUNCTION__);
    return;
  }
  
  [self hdf_safeRemoveObject:obj];
}

- (void)hdf_insertObject:(id)anObject atIndex:(NSUInteger)index {
  if (anObject == nil) {
    RAISEARRAYEXCEPTIONREASON(@"%s can't insert nil into NSMutableArray", __FUNCTION__);
  } else if (index > self.count) {
    RAISEARRAYEXCEPTIONREASON(@"%s index is invalid", __FUNCTION__);
  } else {
    [self hdf_insertObject:anObject atIndex:index];
  }
}
- (id)hdfI_objectAtIndex:(NSUInteger)index{
    
    @autoreleasepool{
        if (self.count == 0) {
            RAISEARRAYEXCEPTIONREASON(@"%s can't get any object from an empty array", __FUNCTION__);
            return nil;
        }
        
        if (index >= self.count) {
            RAISEARRAYEXCEPTIONREASON(@"%s index out of bounds in array", __FUNCTION__);
            return nil;
        }
        
        return [self hdfI_objectAtIndex:index];
    }
   
    
}
- (id)hdfM_objectAtIndex:(NSUInteger)index{
    @autoreleasepool{

    if (self.count == 0) {
        RAISEARRAYEXCEPTIONREASON(@"%s can't get any object from an empty array", __FUNCTION__);
        return nil;
    }
    
    if (index >= self.count) {
        RAISEARRAYEXCEPTIONREASON(@"%s index out of bounds in array", __FUNCTION__);
        return nil;
    }
    
    return [self hdfM_objectAtIndex:index];
    }
}

- (id)hdf_objectAtIndex:(NSUInteger)index {
    @autoreleasepool{
        
        if (self.count == 0) {
            RAISEARRAYEXCEPTIONREASON(@"%s can't get any object from an empty array", __FUNCTION__);
            return nil;
        }
        
        if (index >= self.count) {
            RAISEARRAYEXCEPTIONREASON(@"%s index out of bounds in array", __FUNCTION__);
            return nil;
        }
        
        return [self hdf_objectAtIndex:index];
    }
}

- (void)hdf_safeRemoveObjectAtIndex:(NSUInteger)index {
  if (self.count <= 0) {
    RAISEARRAYEXCEPTIONREASON(@"%s can't get any object from an empty array", __FUNCTION__);
    return;
  }
  
  if (index >= self.count) {
    RAISEARRAYEXCEPTIONREASON(@"%s index out of bound", __FUNCTION__);
    return;
  }

  [self hdf_safeRemoveObjectAtIndex:index];
}

- (void)raiseException:(NSString *)reason{
    NSLog(@"%@", reason);
    NSException *exception = [NSException exceptionWithName:@"ArrayError" reason:reason userInfo:nil];
    [[NSNotificationCenter defaultCenter] postNotificationName:NotificationArrayExceptionName object:exception];
}

@end
