package br.com.celebra.convite;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.widget.TextView;
import android.webkit.WebView;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String BASE_URL =
        "https://celebra-convite.vercelsistemas.workers.dev/e/";

    private FrameLayout capaAtual;
    private CountDownTimer contagemCapa;

    private void removerCapa() {
        if (contagemCapa != null) {
            contagemCapa.cancel();
            contagemCapa = null;
        }
        if (capaAtual != null) {
            ViewGroup parent = (ViewGroup) capaAtual.getParent();
            if (parent != null) parent.removeView(capaAtual);
            capaAtual = null;
        }
    }

    @Override
    public void onDestroy() {
        removerCapa();
        super.onDestroy();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        abrirConviteDoIntent(getIntent());
        mostrarCapa();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        abrirConviteDoIntent(intent);
        mostrarCapa();
    }

    private void mostrarCapa() {
        removerCapa();
        final ViewGroup raiz = findViewById(android.R.id.content);
        if (raiz == null) return;

        final FrameLayout capa = new FrameLayout(this);
        capaAtual = capa;
        capa.setClickable(true);
        capa.setBackgroundColor(Color.rgb(242, 211, 200));

        final ImageView imagem = new ImageView(this);
        imagem.setImageResource(R.drawable.capa_convidado_premium);
        imagem.setScaleType(ImageView.ScaleType.FIT_CENTER);
        imagem.setAdjustViewBounds(false);

        capa.addView(imagem, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        final TextView carregando = new TextView(this);
        carregando.setText("Carregando convite · 3");
        carregando.setTextColor(Color.rgb(84, 17, 47));
        carregando.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
        carregando.setTextSize(14);
        carregando.setLetterSpacing(0.02f);
        carregando.setSingleLine(true);
        carregando.setIncludeFontPadding(false);
        carregando.setGravity(Gravity.CENTER);
        carregando.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_YES);
        final float densidade = getResources().getDisplayMetrics().density;
        GradientDrawable faixa = new GradientDrawable();
        faixa.setColor(Color.argb(240, 255, 248, 239));
        faixa.setCornerRadius(22 * densidade);
        faixa.setStroke(Math.max(1, Math.round(densidade)), Color.argb(190, 184, 139, 69));
        carregando.setBackground(faixa);
        carregando.setElevation(3 * densidade);
        carregando.setPadding(Math.round(16 * densidade), 0, Math.round(16 * densidade), 0);
        capa.addView(carregando, new FrameLayout.LayoutParams(1, 1));

        raiz.addView(capa, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        capa.post(() -> {
            if (capaAtual != capa || imagem.getDrawable() == null) return;

            int largura = Math.min(Math.round(280 * densidade), Math.round(capa.getWidth() * 0.78f));
            FrameLayout.LayoutParams posicao = new FrameLayout.LayoutParams(
                largura,
                Math.round(40 * densidade),
                Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL
            );
            posicao.bottomMargin = Math.round(Math.max(24 * densidade, Math.min(48 * densidade, capa.getHeight() * 0.07f)));
            carregando.setLayoutParams(posicao);

            contagemCapa = new CountDownTimer(3000, 1000) {
                @Override
                public void onTick(long restante) {
                    int segundos = (int) Math.ceil(restante / 1000.0);
                    carregando.setText("Carregando convite · " + segundos);
                }

                @Override
                public void onFinish() {
                    if (capaAtual == capa) removerCapa();
                }
            }.start();
        });

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
