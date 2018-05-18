platform :ios, '8.0'

target 'SLPlayer' do

    use_frameworks!
    pod 'iCarousel', '~> 1.8.3'
    pod 'CLImageEditor'
    pod 'CVCocoaHTTPServer', '~> 1.0'
    pod ‘FBRetainCycleDetector’

end

post_install do |installer|
    installer.pods_project.build_configurations.each do |config|
        config.build_settings['PROVISIONING_PROFILE_SPECIFIER'] = ''
    end
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|
            config.build_settings['PROVISIONING_PROFILE_SPECIFIER'] = ''
        end
    end
end
