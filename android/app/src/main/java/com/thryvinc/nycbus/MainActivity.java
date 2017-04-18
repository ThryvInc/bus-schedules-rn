package com.thryvinc.nycbus;

import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BusSchedules";
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String urlPart = "market://details?id=";
        String pkgName = getApplicationContext().getPackageName();
        new Nagger(this).startNag(urlPart + pkgName, null);
    }
}
