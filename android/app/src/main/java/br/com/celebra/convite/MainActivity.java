package br.com.celebra.convite;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String BASE_URL =
        "https://celebra-convite.vercelsistemas.workers.dev/e/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        abrirConviteDoIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        abrirConviteDoIntent(intent);
    }

    private void abrirConviteDoIntent(Intent intent) {
        if (intent == null || intent.getData() == null || bridge == null) {
            return;
        }

        Uri uri = intent.getData();

        if (!"celebra".equalsIgnoreCase(uri.getScheme()) ||
            !"convite".equalsIgnoreCase(uri.getHost())) {
            return;
        }

        String codigo = uri.getLastPathSegment();

        if (codigo == null || codigo.trim().isEmpty()) {
            return;
        }

        final String destino = BASE_URL + Uri.encode(codigo.trim());
        final WebView webView = bridge.getWebView();

        if (webView == null) {
            return;
        }

        webView.post(() -> webView.loadUrl(destino));
    }
}
